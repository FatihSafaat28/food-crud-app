import { FieldGroup } from "@/app/components/ui/field";
import { Coffee } from "lucide-react";
import React from "react";

export default function LoginLayout({
  children,
  isLogin,
}: {
  children: React.ReactNode;
  isLogin: string;
}) {
  return (
    <main>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <form>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex flex-col items-center gap-2 font-medium">
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <Coffee className="size-6 dark:text-white" />
                    </div>
                    <span className="sr-only">My Coffee</span>
                  </div>
                  <h1 className="text-xl font-bold dark:text-white">
                    {isLogin === "Sign up"
                      ? "Welcome to My Coffee"
                      : "Create your new account"}
                  </h1>
                </div>
                {children}
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
