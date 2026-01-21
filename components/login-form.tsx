import { Coffee, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
  isLogin,
  handleLogin,
}: {
  isLogin: string;
  handleLogin: () => void;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState<any>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<any>({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState<any>({ isOpen: false, isSuccess: false });

  const submitLogin = async () => {
    try {
      const payloadLogin = {
        email: loginData.email,
        password: loginData.password,
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "reqres_746dd67bd84f4cab98b82566173afb71",
      };
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payloadLogin),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", loginData.email);
        setOpen({ isOpen: true, isSuccess: true });
      } else {
        setOpen({ isOpen: true, isSuccess: false });
      }
      console.log("login = ", data);
    } catch (error) {
      console.error("Login error:", error);
      setOpen({ isOpen: true, isSuccess: false });
    }
  };

  const submitRegister = async () => {
    try {
      const payloadRegister = {
        email: registerData.email,
        password: registerData.password,
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "reqres_746dd67bd84f4cab98b82566173afb71",
      };
      const response = await fetch("https://reqres.in/api/register", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payloadRegister),
      });
      const data = await response.json();
      if (data.token) {
        setOpen({ isOpen: true, isSuccess: true });
      } else {
        setOpen({ isOpen: true, isSuccess: false });
      }
      console.log("register = ", data);
    } catch (error) {
      console.error("Register error:", error);
      setOpen({ isOpen: true, isSuccess: false });
    }
  };

  return (
    <>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">
          Email
        </FieldLabel>
        <Input
          className="dark:text-white"
          id="email"
          type="email"
          placeholder="lindsay.ferguson@reqres.in"
          value={isLogin === "Sign up" ? loginData.email : registerData.email}
          onChange={(e: any) => {
            if (isLogin === "Sign up") {
              setLoginData({ ...loginData, email: e.target.value });
            } else {
              setRegisterData({ ...registerData, email: e.target.value });
            }
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
            placeholder="password apa saja"
            value={
              isLogin === "Sign up" ? loginData.password : registerData.password
            }
            onChange={(e: any) => {
              if (isLogin === "Sign up") {
                setLoginData({ ...loginData, password: e.target.value });
              } else {
                setRegisterData({ ...registerData, password: e.target.value });
              }
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>
      <Field>
        <Button
          className="cursor-pointer font-bold"
          type="button"
          onClick={isLogin === "Sign up" ? submitLogin : submitRegister}
        >
          {isLogin === "Sign up" ? "Login" : "Register"}
        </Button>
      </Field>
      <AlertDialog
        open={open.isOpen}
        onOpenChange={(val) => setOpen({ ...open, isOpen: val })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {open.isSuccess
                ? `${isLogin === "Sign up" ? `Login` : `Register`} Success`
                : `${isLogin === "Sign up" ? `Login` : `Register`} Failed`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {open.isSuccess
                ? `Please press Continue to ${
                    isLogin === "Sign up" ? `the homepage.` : `Sign-in`
                  }`
                : `${
                    isLogin === "Sign up" ? `Sign-in` : `Sign-up`
                  } failed. Your email or password is incorrect. Please try again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                if (open.isSuccess) {
                  {
                    if (isLogin === "Sign up") {
                      router.push("/dashboard/menu");
                    } else {
                      handleLogin();
                      setRegisterData({ email: "", password: "" });
                    }
                  }
                } else {
                  if (isLogin === "Sign up") {
                    setLoginData({ email: "", password: "" });
                  } else {
                    setRegisterData({ email: "", password: "" });
                  }
                  setOpen({ ...open, isOpen: false });
                }
              }}
            >
              {open.isSuccess ? "Continue" : "Try Again"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
