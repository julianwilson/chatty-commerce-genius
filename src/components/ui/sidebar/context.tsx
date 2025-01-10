import * as React from "react"
import type { SidebarContext as SidebarContextType } from "./types"
import { useMobile } from "@/hooks/use-mobile"

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<SidebarContextType>({
    isMobile: false,
    openMobile: false,
    setOpenMobile: (open) => setOpenMobile(open),
    toggleSidebar: () => setOpenMobile((prev) => !prev),
  });

  return (
    <SidebarContext.Provider value={state}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
