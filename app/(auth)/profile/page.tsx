import { KYCForm } from "@/components/profile/KYCForm";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-carbon-green-400 mb-2">
          User Profile
        </h1>
        <p className="text-gray-400">
          Manage your account information and API settings
        </p>
      </div>

      <KYCForm />
    </div>
  );
}
