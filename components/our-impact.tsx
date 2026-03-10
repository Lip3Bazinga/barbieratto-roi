"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Users, Zap, Award } from "lucide-react"

const metrics = [
  {
    icon: TrendingUp,
    value: "R$ 50M+",
    label: "Faturamento gerado",
  },
  {
    icon: Users,
    value: "98%",
    label: "Taxa de sucesso",
  },
  {
    icon: Zap,
    value: "3.5x",
    label: "ROI médio",
  },
  {
    icon: Award,
    value: "500+",
    label: "Clientes satisfeitos",
  },
]

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let currentCount = 0

    const timer = setInterval(() => {
      currentCount += increment
      if (currentCount >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(currentCount))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end])

  return (
    <>
      {count}
      {suffix}
    </>
  )
}

export function OurImpact() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Nosso impacto
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resultados que falam por si só
          </h2>
          <p className="text-muted-foreground text-lg">
            Números reais de empresas que escalaram seus negócios com nossa metodologia
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative p-8 rounded-xl border transition-all duration-300 transform ${
                  isVisible ? "opacity-100" : "opacity-0"
                } ${
                  isHovered
                    ? "border-primary/50 bg-card/80 scale-105 shadow-2xl"
                    : "border-border/30 bg-card/40 scale-100 shadow-lg"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                  perspective: "1200px",
                  transform: isHovered
                    ? "translateZ(20px) rotateX(2deg) rotateY(-2deg)"
                    : "translateZ(0px) rotateX(0deg) rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isHovered ? "bg-primary/5" : ""
                  }`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div
                      className={`text-2xl font-bold transition-all duration-300 ${
                        isHovered ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      ↗
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-3xl md:text-4xl font-bold text-foreground">
                      {isVisible ? (
                        <AnimatedCounter
                          end={
                            index === 0
                              ? 50
                              : index === 1
                                ? 98
                                : index === 2
                                  ? 3
                                  : 500
                          }
                          suffix={
                            index === 0
                              ? "M+"
                              : index === 1
                                ? "%"
                                : index === 2
                                  ? "x"
                                  : "+"
                          }
                        />
                      ) : (
                        "0"
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">{metric.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
