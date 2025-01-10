import * as React from "react"
import type { SidebarContext as SidebarContextType } from "./types"
import { useIsMobile } from "@/hooks/use-mobile"

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile()
  const [state, setState] = React.useState<"expanded" | "collapsed">("expanded")
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev)
    } else {
      setState(prev => prev === "expanded" ? "collapsed" : "expanded")
    }
  }, [isMobile])

  const value = React.useMemo(
    () => ({
      isMobile,
      state,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [isMobile, state, openMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}