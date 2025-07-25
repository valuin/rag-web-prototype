import * as React from "react";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar";
import {
  RiChat1Line,
  RiBardLine,
  RiMickeyLine,
  RiMicLine,
  RiCheckDoubleLine,
  RiBracesLine,
  RiPlanetLine,
  RiSeedlingLine,
  RiSettings3Line,
  RiDashboardLine,
} from "@remixicon/react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Universitas 1",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/logo-01_upxvqe.png",
    },
    {
      name: "Universitas 2",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/logo-01_upxvqe.png",
    },
    {
      name: "Universitas 3",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/logo-01_upxvqe.png",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      items: [
        {
          title: "Kalender Akademik",
          url: "/#",
          icon: RiChat1Line,
          isActive: true,
        },
        {
          title: "POS",
          url: "/#",
          icon: RiBardLine,
        }
      ],
    },
    {
      title: "More",
      url: "#",
      items: [
        {
          title: "Admin Dashboard",
          url: "/admin",
          icon: RiDashboardLine,
        },
        {
          title: "Settings",
          url: "#",
          icon: RiSettings3Line,
        },
      ],
    },
  ],
};

import { useState } from "react";

export function AppSidebar({ onModeChange, ...props }: React.ComponentProps<typeof Sidebar> & { onModeChange: (mode: string) => void }) {
  const [activeItem, setActiveItem] = useState("Kalender Akademik");

  const handleItemClick = (title: string) => {
    setActiveItem(title);
    onModeChange(title.toLowerCase().replace(/\s/g, '')); // Normalize the mode string
  };

  return (
    <Sidebar {...props} className="dark !border-none">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* We only show the first parent group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {data.navMain[0]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[0]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto"
                    isActive={activeItem === item.title}
                    onClick={() => handleItemClick(item.title)}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
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
        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {data.navMain[1]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[1]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-muted-foreground/70 group-data-[active=true]/menu-button:text-primary"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
