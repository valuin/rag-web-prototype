"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar";
import Chat from "@/components/chat";
import { User } from "lucide-react"; // Import the User icon from lucide-react

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export default function Page() {
  const normalizeMode = (mode: string) => mode.toLowerCase().replace(/\s/g, '-');
  const initialMode = normalizeMode("Marketing Management"); // Set initial mode to Marketing Management
  const [chatMode, setChatMode] = useState(initialMode);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({
    [normalizeMode("Kalender Akademik")]: [],
    [normalizeMode("Marketing Management")]: [],
    [normalizeMode("Macroeconomics")]: [],
    [normalizeMode("Supply Chain")]: [],
    [normalizeMode("POS")]: [],
  });

  const handleModeChange = (mode: string) => {
    setChatMode(normalizeMode(mode));
  };

  const handleSetMessages = (newMessages: Message[]) => {
    setChatHistories((prevHistories) => ({
      ...prevHistories,
      [chatMode]: newMessages,
    }));
  };

  return (
    <SidebarProvider>
      <AppSidebar onModeChange={handleModeChange} />
      <SidebarInset className="bg-sidebar group/sidebar-inset">
        <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <nav className="flex items-center text-sm font-medium max-sm:hidden">
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
                aria-current
              >
                Playground
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
              >
                Dashboard
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
              >
                Docs
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
              >
                API Reference
              </a>
            </nav>
            <User className="h-6 w-6 text-sidebar-foreground/70" />
          </div>
        </header>
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          <Chat
            mode={chatMode}
            messages={chatHistories[chatMode]}
            setMessages={handleSetMessages}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
