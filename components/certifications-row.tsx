"use client"

import { useEffect, useRef, useState } from "react"

const certifications = [
  {
    id: "google-partner",
    name: "Google Partner",
    color: "#4285F4",
  },
  {
    id: "meta-partner",
    name: "Meta Business Partner",
    color: "#0A66C2",
  },
  {
    id: "pinterest",
    name: "Pinterest ADS!",
    color: "#E60023",
  },
  {
    id: "linkedin",
    name: "LinkedIn ads",
    color: "#0A66C2",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    color: "#000000",
  },
]

export function CertificationsRow() {
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
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Certificações
          </h2>
          <p className="text-muted-foreground text-base mt-2">
            Certificados pelos maiores players de marketing digital
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative transition-all duration-500 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
              }}
            >
              {/* Metallic Badge Container */}
              <div
                className={`flex items-center justify-center w-32 h-32 rounded-xl border-2 transition-all duration-300 ${
                  hoveredIndex === index
                    ? "border-primary/80 bg-white shadow-2xl"
                    : "border-border bg-white shadow-lg"
                }`}
                style={{
                  background: hoveredIndex === index
                    ? `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)`
                    : "white",
                }}
              >
                {/* Monochrome Logo Placeholder (in production, replace with actual logos) */}
                <div
                  className={`text-center px-4 transition-all duration-300 ${
                    hoveredIndex === index ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="w-full h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-gray-700 font-semibold text-xs text-center px-2">
                      {cert.name}
                    </span>
                  </div>
                </div>

                {/* Color Logo on Hover */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl transition-all duration-300 ${
                    hoveredIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: cert.color }}>
                    <span className="text-white font-bold text-lg">★</span>
                  </div>
                </div>

                {/* Shine Effect */}
                <div
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none ${
                    hoveredIndex === index ? "bg-gradient-to-r from-transparent via-white to-transparent" : ""
                  }`}
                  style={{
                    animation: hoveredIndex === index ? "metallic-shine 2s infinite" : "none",
                  }}
                />
              </div>

              {/* Hover Label */}
              <div
                className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-300 ${
                  hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <p className="text-xs font-semibold text-foreground whitespace-nowrap mt-12">
                  {cert.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes metallic-shine {
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
