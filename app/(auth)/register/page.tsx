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
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuth();
  const isMounted = useRef(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Mount tracking effect
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Redirect effect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validateName = (name: string): string => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

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
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string,
  ): string => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    let error = "";
    switch (field) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        // Also revalidate confirm password if it's been touched
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(
              formData.confirmPassword,
              value,
            ),
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, formData.password);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Check if there are any errors
    if (nameError || emailError || passwordError || confirmPasswordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
      });

      if (!isMounted.current) return;

      toast.success("Registration successful! Redirecting...");
      // Immediate redirect using replace to prevent back button issues
      router.replace("/dashboard");
    } catch (error) {
      if (!isMounted.current) return;
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const isPasswordValid = passwordRequirements.every((req) =>
    req.test(formData.password),
  );

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
              <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
              <span>New account</span>
            </div>
            <CardTitle className="text-4xl font-extrabold text-white heading-display">
              Create account
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Get started with your free trading account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`h-12 text-base ${touched.name && errors.name ? "border-destructive" : ""}`}
                />
                {touched.name && errors.name && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

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
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`h-12 text-base ${touched.email && errors.email ? "border-destructive" : ""}`}
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => {
                    handleBlur("password");
                    setShowPasswordRequirements(false);
                  }}
                  className={`h-12 text-base ${touched.password && errors.password ? "border-destructive" : ""}`}
                />

                {/* Password Requirements */}
                {(showPasswordRequirements ||
                  (touched.password && formData.password)) && (
                  <div className="space-y-2 p-4 rounded-xl glass">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Password must contain:
                    </p>
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(formData.password);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          {isValid ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span
                            className={
                              isValid ? "text-success" : "text-muted-foreground"
                            }
                          >
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`h-12 text-base ${touched.confirmPassword && errors.confirmPassword ? "border-destructive" : ""}`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
                {touched.confirmPassword &&
                  !errors.confirmPassword &&
                  formData.confirmPassword && (
                    <div className="flex items-center gap-1.5 text-success text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Passwords match</span>
                    </div>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-full hover:scale-105 transition-transform mt-6"
                disabled={
                  isLoading ||
                  !isPasswordValid ||
                  !!errors.name ||
                  !!errors.email ||
                  !!errors.confirmPassword
                }
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
