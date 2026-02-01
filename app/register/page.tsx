import RegisterForm from "@/app/components/register-form";
import LoginLayout from "@/app/components/login-layout";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <LoginLayout isStatus="register">
      <div className="flex justify-center gap-1 text-gray-500">
        <span>Already have an account?</span>
        <Link
          href="/"
          className="cursor-pointer hover:underline hover:text-black dark:hover:text-gray-200"
        >
          Sign in
        </Link>
      </div>
      <RegisterForm />
    </LoginLayout>
  );
}
