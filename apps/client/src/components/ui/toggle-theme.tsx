"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ToggleTheme() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon"
        className="text-3xl text-center px-20">
                `Theme`
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => setTheme("star")}>
          Star
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("snow")}>
          Snow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("city")}>
          City
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("haunt")}>
          Haunt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
