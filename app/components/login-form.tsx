import { Coffee, Eye, EyeOff } from "lucide-react";
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
    name:"",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState<any>({ isOpen: false, isSuccess: false });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false)

  const submitLogin = async () => {
    setLoading(true);
    try {
      const payloadLogin = {
        email: loginData.email,
        password: loginData.password,
      };
      const result = await signIn("credentials", { ...payloadLogin, redirect: false });
      console.log({...payloadLogin})
      if (!result?.error) {
        await getSession();
        setOpen({ isOpen: true, isSuccess: true });
      } else {
        console.log(result);
        setError("Password atau Email Salah");
        setOpen({ isOpen: true, isSuccess: false });
      }
    } catch (error) {
      console.error("Login error:", error);
      setOpen({ isOpen: true, isSuccess: false });
    } finally{
      setLoading(false);
    }
  };

  const submitRegister = async () => {
    setLoading(true);
    try {
      const payloadRegister = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      };
      console.log("payloadRegister : ", payloadRegister);
      const response = await fetch("/api/auth/register", {
        method:"POST",
        headers : {
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
      console.log("register = ", data);
    } catch (error) {
      console.error("Register error:", error);
      setOpen({ isOpen: true, isSuccess: false });
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
    {isLogin === "Sign up" ? (<></>) : (
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
          onChange={(e: any) => {
            setRegisterData({ ...registerData, name: e.target.value });
          }}
          required
        />
      </Field>
    )}
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">
          Email
        </FieldLabel>
        <Input
          className="dark:text-white"
          id="email"
          type="email"
          placeholder="example@mail.com"
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
            placeholder="your password"
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
          {loading ? (
            <Spinner/>
          ) : isLogin === "Sign up" ? (
            "Login"
          ) : (
            "Register"
          )}
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
                      router.refresh();
                    } else {
                      handleLogin();
                      setRegisterData({ email: "", password: "" });
                    }
                  }
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
    </>
  );
}
