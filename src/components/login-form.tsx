"use client";

import type React from "react";
import { toast } from "sonner";
import { signIn, useSession, signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/v0-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/v0-card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/v0-field";
import { Input } from "@/components/ui/v0-input";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onClose?: () => void;
  onSignupRequest?: () => void;
}

export function LoginForm({
  className,
  onClose,
  onSignupRequest,
  ...props
}: LoginFormProps) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login Successful!", {
      description: "Welcome back to your budget tracker.",
      duration: 2000,
    });

    if (onClose) {
      onClose();
    }
  };

  const handleSignupLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignupRequest) {
      onSignupRequest();
    }
  };
  const handleLogout = async () => {
    await signOut();
    if (onClose) {
      onClose();
    }
    toast.info("Deconectare reușită", {
      description: "Ai fost deconectat cu succes.",
      duration: 3000,
    });
  };
  const handleGoogleLogin = () => {
    signIn("google");
  };
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="p-8 h-48 flex items-center justify-center">
          <CardTitle className="animate-pulse">
            Verificare stare sesiune...
          </CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{session ? "Account Status" : "Log In"}</CardTitle>
          <CardDescription>
            {session
              ? `You are currently logged in as ${
                  session.user?.email || "user"
                }.`
              : "Enter your email below to log in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="flex flex-col gap-4 pt-2">
              <Button type="button" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email-login">Email</FieldLabel>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password-login">Password</FieldLabel>
                  <Input id="password-login" type="password" required />
                </Field>

                <Field>
                  <Button type="submit">Log In</Button>

                  <Button type="button" onClick={handleGoogleLogin}>
                    Log in using Google
                  </Button>

                  <FieldDescription className="text-center">
                    Don't have an account?{" "}
                    <a href="#" onClick={handleSignupLinkClick}>
                      Sign up
                    </a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
