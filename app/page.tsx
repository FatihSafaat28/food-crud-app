import LoginForm from "@/app/login-form";
import LoginLayout from "@/app/login-layout";
import Link from "next/link";

export default function Home() {
  return (
    <LoginLayout>
      <div className="flex justify-center gap-1 text-gray-500">
        <span>Don't have an account?</span>
        <Link
          href="/register"
          className="cursor-pointer hover:underline hover:text-black dark:hover:text-gray-200"
        >
          Sign up
        </Link>
      </div>
      <LoginForm />
    </LoginLayout>
  );
}