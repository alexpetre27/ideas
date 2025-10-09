"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import React from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type UserData = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
interface NavUserProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

function LoggedInContent({
  user,
  isMobile,
}: {
  user: UserData;
  isMobile: boolean;
}) {
  const dropdownSide = isMobile ? "bottom" : "right";
  const dropdownAlign = "end" as const;

  const userName = user.name || "Utilizator";
  const userEmail = user.email || "Fără email";
  const userAvatar = user.image || undefined;
  const initials = userName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userName}</span>
            <span className="truncate text-xs">{userEmail}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={dropdownSide}
        align={dropdownAlign}
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="truncate text-xs">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
function LoggedOutContent({
  isMobile,
  onLoginClick,
  onSignupClick,
}: {
  isMobile: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}) {
  const dropdownSide = isMobile ? "bottom" : "right";
  const dropdownAlign = "end" as const;

  return (
    <>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <LogIn className="size-5" />
          <span className="flex-1 text-left font-medium">Account</span>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={dropdownSide}
        align={dropdownAlign}
        sideOffset={4}
      >
        <DropdownMenuLabel>Welcome!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onLoginClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignupClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </>
  );
}

export function NavUser({ onLoginClick, onSignupClick }: NavUserProps) {
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();

  const userIsAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  let content;

  if (isLoading) {
    content = (
      <SidebarMenuButton size="lg" disabled>
        <Loader2 className="size-5 animate-spin" />
        <span className="flex-1 text-left font-medium">Loading...</span>
      </SidebarMenuButton>
    );
  } else if (userIsAuthenticated && session?.user) {
    content = (
      <DropdownMenu>
        <LoggedInContent user={session.user as UserData} isMobile={isMobile} />
      </DropdownMenu>
    );
  } else {
    content = (
      <DropdownMenu>
        <LoggedOutContent
          isMobile={isMobile}
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
        />
      </DropdownMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>{content}</SidebarMenuItem>
    </SidebarMenu>
  );
}
