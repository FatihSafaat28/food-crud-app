"use client";
import { LoginForm } from "@/app/components/login-form";
import LoginLayout from "@/app/components/login-layout";
import { useState } from "react";

export default function Home() {
  const [isStatus, setStatus] = useState("login");
  const handleLogin = () => {
    if (isStatus === "login") {
      setStatus("register");
    } else {
      setStatus("login");
    }
  };
  return (
    <LoginLayout isStatus={isStatus}>
      <div className="flex justify-center gap-1 text-gray-500">
        <span>
          {isStatus === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <div
          className="cursor-pointer hover:underline hover:text-black dark:hover:text-gray-200"
          onClick={handleLogin}
        >
          {isStatus === "login" ? "Sign up" : "Sign in"}
        </div>
      </div>
      <LoginForm isStatus={isStatus} handleLogin={handleLogin} />
    </LoginLayout>
  );
}