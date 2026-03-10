"use client"

import { useEffect, useRef, useState } from "react"

const metrics = [
  {
    value: "15",
    label: "anos de história",
    suffix: "+",
  },
  {
    value: "300",
    label: "clientes atendidos",
    suffix: "+",
  },
  {
    value: "100",
    label: "milhões faturados",
    suffix: "+",
  },
  {
    value: "60",
    label: "especialistas dedicados",
    suffix: "+",
  },
]

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

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
  }, [end, isVisible])

  return (
    <span onIntersection={() => setIsVisible(true)}>
      {count}
      {suffix}
    </span>
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
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-background">
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4 font-semibold">
            Resultados reais
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Resultados reais, histórias comprovadas
          </h2>
          <p className="text-muted-foreground text-lg">
            Junte-se a nós e impulsione suas vendas!
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative p-8 rounded-lg border transition-all duration-300 transform overflow-hidden ${
                  isVisible ? "opacity-100" : "opacity-0"
                } ${
                  isHovered
                    ? "border-primary/50 bg-white scale-105 shadow-2xl"
                    : "border-border bg-card scale-100 shadow-md"
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
                {/* Metallic Shine Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isHovered ? "bg-gradient-to-r from-transparent via-white to-transparent" : ""
                  }`}
                  style={{
                    animation: isHovered ? "shimmer 2s infinite" : "none",
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="space-y-3">
                    <p className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                      {isVisible ? (
                        <>
                          {metric.value}
                          <span className="text-primary">{metric.suffix}</span>
                        </>
                      ) : (
                        "0"
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
                      {metric.label}
                    </p>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-transparent transition-all duration-300 ${
                    isHovered ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}
