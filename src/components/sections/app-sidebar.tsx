"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast, Toaster } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// --------------------

import { NavUser } from "../ui/nav-user";
import { LoginForm } from "@/components/ui/login-form";
import { SignupForm } from "@/components/ui/signup-form";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ContentProps {
  onClose: () => void;
}
interface SwitchContentProps extends ContentProps {
  onSwitch: () => void;
}

function LoginModalContent({ onClose, onSwitch }: SwitchContentProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Autentificare în Budget Tracker
      </h2>
      <LoginForm onClose={onClose} onSignupRequest={onSwitch} />
    </div>
  );
}
function SignupModalContent({ onClose, onSwitch }: SwitchContentProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Creează-ți Contul</h2>
      <SignupForm onClose={onClose} onLoginRequest={onSwitch} />
    </div>
  );
}

const AppModal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-2xl p-4 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const items = [{ title: "Acasă", url: "/dashboard", icon: Home }];

export function AppSidebar() {
  const { data: session, status } = useSession();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [shouldAnnounceLoginClose, setShouldAnnounceLoginClose] =
    useState(false);

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setShouldAnnounceLoginClose(true);
  };
  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };
  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };
  const handleLoginToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };
  const handleSignupToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    if (!shouldAnnounceLoginClose) {
      return;
    }

    toast.info("Fereastra de autentificare închisă.", {
      description: "Fereastra de logare a fost închisă.",
    });
    setShouldAnnounceLoginClose(false);
  }, [shouldAnnounceLoginClose]);

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Budget Tracker</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          {status === "loading" && (
            <div className="p-4 text-sm text-muted-foreground">
              Se încarcă...
            </div>
          )}

          {status === "unauthenticated" && (
            <NavUser
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
            />
          )}

          {status === "authenticated" && session && (
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4 p-2 rounded-lg border">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name ?? ""}
                  />
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name.charAt(0)
                      : session?.user?.email?.charAt(0) ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm overflow-hidden">
                  <p className="font-medium truncate">
                    {session?.user?.name ?? session?.user?.email ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email ?? ""}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut({ redirectTo: "/" })}
              >
                Deconectare
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      <AppModal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <LoginModalContent
          onClose={closeLoginModal}
          onSwitch={handleLoginToSignup}
        />
      </AppModal>
      <AppModal isOpen={isSignupModalOpen} onClose={closeSignupModal}>
        <SignupModalContent
          onClose={closeSignupModal}
          onSwitch={handleSignupToLogin}
        />
      </AppModal>
      <Toaster />
    </>
  );
}
