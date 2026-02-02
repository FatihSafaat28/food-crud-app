"use client";
import { Eye, EyeOff } from "lucide-react";
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
import { Spinner } from "@/app/components/ui/spinner";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState({ isOpen: false, isSuccess: false });
  const [loading, setLoading] = useState(false);

  const submitRegister = async () => {
    setLoading(true);
    try {
      const payloadRegister = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      };
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadRegister),
      });
      const data = await response.json();

      if (data.status === 201) {
        setOpen({ isOpen: true, isSuccess: true });
      } else {
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
    submitRegister();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="name">
          Nama
        </FieldLabel>
        <Input
          className="dark:text-white"
          id="name"
          type="text"
          placeholder="your name"
          value={registerData.name}
          onChange={(e) => {
            setRegisterData({ ...registerData, name: e.target.value });
          }}
          required
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">
          Email
        </FieldLabel>
        <Input
          className="dark:text-white"
          id="email"
          type="email"
          placeholder="example@mail.com"
          value={registerData.email}
          onChange={(e) => {
            setRegisterData({ ...registerData, email: e.target.value });
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
            value={registerData.password}
            onChange={(e) => {
              setRegisterData({ ...registerData, password: e.target.value });
            }}
            required
          />
          <Button
            id="show-password-button"
            data-testid="show-password-button"
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
        <Button className="cursor-pointer font-bold" type="submit" aria-label="Register">
          {loading ? <Spinner /> : "Register"}
        </Button>
      </Field>
      <AlertDialog
        open={open.isOpen}
        onOpenChange={(val) => setOpen({ ...open, isOpen: val })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {open.isSuccess ? "Register Success" : "Register Failed"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {open.isSuccess
                ? "Please press Continue to Sign-in"
                : "Sign-up failed. Your email or password is incorrect. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              aria-label={open.isSuccess ? "Continue to Login" : "Try Again"}
              className="cursor-pointer"
              onClick={() => {
                if (open.isSuccess) {
                  router.push("/");
                  setRegisterData({ name: "", email: "", password: "" });
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
