"use client";

import type React from "react";
import { toast } from "sonner";

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
import { signIn, useSession, signOut } from "next-auth/react";

interface SignupFormProps extends React.ComponentProps<"div"> {
  onClose?: () => void;
  onLoginRequest?: () => void;
}

export function SignupForm({
  className,
  onClose,
  onLoginRequest,
  ...props
}: SignupFormProps) {
  const MIN_AGE = 16;
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const dobValue = formData.get("dob") as string;
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < MIN_AGE) {
        toast.error("Înregistrare eșuată", {
          description: `Trebuie să ai minim ${MIN_AGE} ani pentru a-ți crea un cont.`,
          duration: 4000,
        });
        return;
      }
    } else {
      toast.error("Eroare de validare", {
        description: "Te rugăm să introduci Data Nașterii.",
        duration: 3000,
      });
      return;
    }
    console.log("Înregistrare reușită. Vârsta validată.");
    toast.success("Înregistrare reușită!", {
      description: "Contul tău a fost creat. Bine ai venit!",
      duration: 3000,
    });
    if (onClose) {
      onClose();
    }
  };
  const handleLoginLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLoginRequest) {
      onLoginRequest();
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
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="p-8 h-48 flex items-center justify-center">
          <CardTitle className="animate-pulse">
            Se verifică starea sesiunii...
          </CardTitle>
        </Card>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {session ? "Account Status" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {session
              ? `You are currently logged in as ${
                  session.user?.email || "user"
                }.`
              : "Enter your details below to create a new account"}
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
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email-signup">Email</FieldLabel>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                  <Input id="dob" name="dob" type="date" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password-signup">Password</FieldLabel>
                  <Input id="password-signup" type="password" required />
                </Field>

                <Field>
                  <Button type="submit">Sign Up</Button>
                  <Button type="button" onClick={() => signIn("google")}>
                    Sign Up using Google
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <a href="#" onClick={handleLoginLinkClick}>
                      Log in
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
