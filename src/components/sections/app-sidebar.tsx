"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NavUser } from "../ui/nav-user";
import { LoginForm } from "@/components/ui/login-form";
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
const items = [
  { title: "Acasă", url: "#", icon: Home },
  { title: "Mesaje", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Căutare", url: "#", icon: Search },
  { title: "Setări", url: "#", icon: Settings },
];

export function AppSidebar() {
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
          <NavUser
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
          />
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
    </>
  );
}
