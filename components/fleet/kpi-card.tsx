"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

interface KPICardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  color: "metro-blue" | "metro-teal" | "metro-green" | "metro-red" | "metro-purple"
  delay?: number
  icon?: ReactNode
}

export function KPICard({ title, value, change, changeType = "neutral", color, delay = 0, icon }: KPICardProps) {
  const [animatedValue, setAnimatedValue] = useState("0")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      // Extract numeric value for animation
      const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
      if (!isNaN(numericValue)) {
        let current = 0
        const increment = numericValue / 30
        const interval = setInterval(() => {
          current += increment
          if (current >= numericValue) {
            current = numericValue
            clearInterval(interval)
          }
          setAnimatedValue(value.includes("%") ? `${Math.round(current)}%` : Math.round(current).toString())
        }, 50)
      } else {
        setAnimatedValue(value)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  const colorClasses = {
    "metro-blue": "border-l-[hsl(var(--metro-blue))] bg-[hsl(var(--metro-blue))]/5",
    "metro-teal": "border-l-[hsl(var(--metro-teal))] bg-[hsl(var(--metro-teal))]/5",
    "metro-green": "border-l-[hsl(var(--metro-green))] bg-[hsl(var(--metro-green))]/5",
    "metro-red": "border-l-[hsl(var(--metro-red))] bg-[hsl(var(--metro-red))]/5",
    "metro-purple": "border-l-[hsl(var(--metro-purple))] bg-[hsl(var(--metro-purple))]/5",
  }

  const iconColorClasses = {
    "metro-blue": "text-[hsl(var(--metro-blue))]",
    "metro-teal": "text-[hsl(var(--metro-teal))]",
    "metro-green": "text-[hsl(var(--metro-green))]",
    "metro-red": "text-[hsl(var(--metro-red))]",
    "metro-purple": "text-[hsl(var(--metro-purple))]",
  }

  const changeColorClasses = {
    positive: "text-[hsl(var(--success))]",
    negative: "text-[hsl(var(--metro-red))]",
    neutral: "text-muted-foreground",
  }

  return (
    <Card
      className={`transition-all duration-500 hover:shadow-lg hover:scale-105 border-l-4 ${colorClasses[color]} ${isVisible ? "animate-slide-in" : "opacity-0"}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon && <div className={iconColorClasses[color]}>{icon}</div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground animate-count-up mb-2">{animatedValue}</div>
        {change && <p className={`text-xs ${changeColorClasses[changeType]} font-medium`}>{change}</p>}
      </CardContent>
    </Card>
  )
}
