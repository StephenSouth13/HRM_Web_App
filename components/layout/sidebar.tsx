"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  Clock,
  Award,
  DollarSign,
  MessageSquare,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  role: string[]
}

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    setUserRole(role)
  }, [])

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: `/dashboard/${userRole}`,
      icon: <Home className="w-5 h-5" />,
      role: ["BOD", "LEADER", "EMPLOYEE"],
    },
    { label: "Organization", href: "/organization", icon: <BarChart3 className="w-5 h-5" />, role: ["bod"] },
    { label: "Employees", href: "/employees", icon: <Users className="w-5 h-5" />, role: ["bod", "leader"] },
    {
      label: "Attendance",
      href: "/attendance",
      icon: <Clock className="w-5 h-5" />,
      role: ["bod", "leader", "employee"],
    },
    {
      label: "Evaluations",
      href: "/evaluations",
      icon: <Award className="w-5 h-5" />,
      role: ["bod", "leader", "employee"],
    },
    { label: "Payroll", href: "/payroll", icon: <DollarSign className="w-5 h-5" />, role: ["bod", "leader"] },
    {
      label: "Meetings",
      href: "/meetings",
      icon: <MessageSquare className="w-5 h-5" />,
      role: ["bod", "leader", "employee"],
    },
    { label: "Workflows", href: "/workflows", icon: <Zap className="w-5 h-5" />, role: ["bod", "leader"] },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      role: ["bod", "leader", "employee"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => userRole && item.role.includes(userRole))

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border lg:translate-x-0 z-40 pt-16 lg:pt-0 flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">LIFE OS</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">HRM System</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
