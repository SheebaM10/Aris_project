"use client"
import * as React from "react"
import { ARISEnhancedDashboard } from "@/components/aris-dashboard-clean"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"

export default function Page() {
  return (
    <main className="font-sans px-4 py-6 md:px-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-semibold text-pretty">
              ARIS — AI Resource Intelligence System
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            <strong>Workforce Intelligence Platform</strong><br />
            Create skill requests, run AI analysis, and manage workforce resources with intelligent matching and email communication.
          </p>
        </div>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </header>

      <ARISEnhancedDashboard />
    </main>
  )
}
