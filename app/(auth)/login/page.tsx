"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();
  const isMounted = useRef(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    // More robust email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    // Check if there are any errors
    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await login({ email: email.trim(), password });
      if (!isMounted.current) return;

      if ("requiresTwoFactor" in response && response.requiresTwoFactor) {
        toast.info("2FA required, redirecting...");
        router.push("/2fa"); // TODO: Create 2FA page
        return;
      }

      toast.success("Login successful! Redirecting...");
      // Immediate redirect using replace to prevent back button issues
      router.replace("/dashboard");
    } catch (error) {
      if (!isMounted.current) return;

      // Handle specific error messages
      let message = "Login failed. Please try again.";

      if (error instanceof Error) {
        message = error.message;

        // Provide more helpful error messages
        if (
          message.includes("Invalid credentials") ||
          message.includes("User not found")
        ) {
          message =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (message.includes("Account locked")) {
          message =
            "Your account has been locked due to too many failed login attempts. Please try again later.";
        } else if (message.includes("Network")) {
          message =
            "Network error. Please check your connection and try again.";
        }
      }

      toast.error(message);
    }
  };

  const isFormValid = !errors.email && !errors.password && email && password;

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl hover-lift">
          <CardHeader className="space-y-3 text-center pb-8 px-8 pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-2 uppercase tracking-wider mx-auto">
              <LogIn className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Secure login</span>
            </div>
            <CardTitle className="text-4xl font-extrabold text-white heading-display">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to your account to continue trading
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={`h-12 text-base ${touched.email && errors.email ? "border-destructive" : ""}`}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={handlePasswordBlur}
                    className={`h-12 text-base pr-10 ${touched.password && errors.password ? "border-destructive" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-full hover:scale-105 transition-transform"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
