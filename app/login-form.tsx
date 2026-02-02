"use client";
import dynamic from "next/dynamic";
import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Spinner } from "@/app/components/ui/spinner";

// Dynamic imports for icons to reduce initial bundle size
const Eye = dynamic(() => import("lucide-react").then((mod) => mod.Eye), {
  ssr: false,
});
const EyeOff = dynamic(() => import("lucide-react").then((mod) => mod.EyeOff), {
  ssr: false,
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [open, setOpen] = useState({ isOpen: false, isSuccess: false });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async () => {
    setLoading(true);
    try {
      const payloadLogin = {
        email: loginData.email,
        password: loginData.password,
      };
      const result = await signIn("credentials", {
        ...payloadLogin,
        redirect: false,
      });
      if (!result?.error) {
        await getSession();
        setOpen({ isOpen: true, isSuccess: true });
      } else {
        setError("Password atau Email Salah");
        setOpen({ isOpen: true, isSuccess: false });
      }
    } catch (error) {
      setOpen({ isOpen: true, isSuccess: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">
          Email
        </FieldLabel>
        <Input
          className="dark:text-white"
          id="email"
          type="email"
          placeholder="example@mail.com"
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
          }}
          required
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="password">
          Password
        </FieldLabel>
        <div className="relative">
          <Input
            className="dark:text-white"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="your password"
            value={loginData.password}
            onChange={(e) => {
              setLoginData({ ...loginData, password: e.target.value });
            }}
            required
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </Field>
      <Field>
        <Button className="cursor-pointer font-bold" type="submit" aria-label="Login">
          {loading ? <Spinner /> : "Login"}
        </Button>
      </Field>
      <AlertDialog
        open={open.isOpen}
        onOpenChange={(val) => setOpen({ ...open, isOpen: val })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {open.isSuccess ? "Login Success" : "Login Failed"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {open.isSuccess
                ? "Please press Continue to the homepage."
                : "Sign-in failed. Your email or password is incorrect. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              aria-label={open.isSuccess ? "Continue to the homepage" : "Try Again"}
              className="cursor-pointer"
              onClick={() => {
                if (open.isSuccess) {
                  router.push("/dashboard/menu");
                  router.refresh();
                } else {
                  setOpen({ ...open, isOpen: false });
                }
              }}
            >
              {open.isSuccess ? "Continue" : "Try Again"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
