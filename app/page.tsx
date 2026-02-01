"use client";
import { LoginForm } from "@/app/components/login-form";
import LoginLayout from "@/app/components/login-layout";
import { useState } from "react";

export default function Home() {
  const [isLogin, setLogin] = useState("Sign up");
  const handleLogin = () => {
    if (isLogin === "Sign up") {
      setLogin("Sign in");
    } else {
      setLogin("Sign up");
    }
  };
  return (
    <LoginLayout isLogin={isLogin}>
      <div className="flex justify-center gap-1 text-gray-500">
        <span>
          {isLogin === "Sign up"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <div
          className="cursor-pointer hover:underline hover:text-black dark:hover:text-gray-200"
          onClick={handleLogin}
        >
          {isLogin}
        </div>
      </div>
      <LoginForm isLogin={isLogin} handleLogin={handleLogin} />
    </LoginLayout>
  );
}

//  Test Login
//  Email : lindsay.ferguson@reqres.in
//  Password : [apa saja]

//  Test Register
//  Email : lindsay.ferguson@reqres.in
//  Password : [apa saja]
