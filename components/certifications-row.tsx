"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const certifications = [
  {
    id: "google-partner",
    name: "Google Partner",
    logo: "/logos/google-partner.jpg",
  },
  {
    id: "meta-partner",
    name: "Meta Business Partner",
    logo: "/logos/meta-business-partner.jpg",
  },
  {
    id: "pinterest",
    name: "Pinterest ADS!",
    logo: "/logos/pinterest-ads.jpg",
  },
  {
    id: "linkedin",
    name: "LinkedIn ads",
    logo: "/logos/linkedin-ads.jpg",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    logo: "/logos/tiktok-ads.jpg",
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
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
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
              {/* Logo Container */}
              <div
                className={`flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                  hoveredIndex === index
                    ? "border-primary/80 bg-white shadow-2xl"
                    : "border-border bg-white shadow-lg grayscale"
                }`}
              >
                <Image
                  src={cert.logo}
                  alt={cert.name}
                  width={140}
                  height={140}
                  className={`w-full h-full object-contain p-4 transition-all duration-300 ${
                    hoveredIndex === index ? "grayscale-0" : "grayscale"
                  }`}
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
    </section>
  )
}
