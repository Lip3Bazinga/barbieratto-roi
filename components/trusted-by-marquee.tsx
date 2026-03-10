"use client"

import { useEffect, useRef, useState } from "react"

const companies = [
  { name: "Irroba", color: "#FF6B35" },
  { name: "Shoppub", color: "#2E86AB" },
  { name: "Vtex", color: "#FA7921" },
  { name: "Nuvemshop", color: "#0066CC" },
  { name: "SoftUp ERP", color: "#8B4513" },
  { name: "Bling/", color: "#FF5722" },
  { name: "Olist", color: "#FF6B9D" },
  { name: "Pagar.me", color: "#0099FF" },
  { name: "Mercado Pago", color: "#FFC300" },
  { name: "PayPal", color: "#003087" },
  { name: "RD Station", color: "#E74C3C" },
  { name: "Flowbiz", color: "#1E90FF" },
  { name: "Revi", color: "#9B59B6" },
  { name: "Martz", color: "#E67E22" },
  { name: "CartStack", color: "#27AE60" },
]

export function TrustedByMarquee() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden border-t border-b border-border/30"
    >
      <div
        className={`max-w-7xl mx-auto px-4 text-center transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-8">
          Parceiros integrados
        </p>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
          
          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Marquee Content */}
          <div className="flex animate-scroll">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex gap-6 md:gap-8 min-w-max px-4">
                {companies.map((company) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="group relative flex items-center justify-center px-6 py-4 rounded-lg border border-border/20 bg-card/30 hover:bg-card/60 transition-all duration-300 cursor-pointer hover:border-primary/30 min-w-max overflow-hidden"
                  >
                    {/* Grayscale Default State */}
                    <div
                      className={`flex items-center justify-center font-semibold text-sm transition-all duration-300 group-hover:opacity-0 absolute ${
                        company.name.length > 12 ? "text-xs px-2" : ""
                      }`}
                      style={{ color: "#999999", filter: "grayscale(100%)" }}
                    >
                      {company.name}
                    </div>

                    {/* Color Hover State */}
                    <div
                      className="flex items-center justify-center font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ color: company.color }}
                    >
                      {company.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
