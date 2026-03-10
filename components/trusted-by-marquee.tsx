"use client"

import { useEffect, useRef, useState } from "react"

const companies = [
  { name: "Stripe", logo: "S" },
  { name: "Figma", logo: "F" },
  { name: "Vercel", logo: "V" },
  { name: "Notion", logo: "N" },
  { name: "Slack", logo: "SL" },
  { name: "GitHub", logo: "GH" },
  { name: "Framer", logo: "FR" },
  { name: "Adobe", logo: "AD" },
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
          Confiado por empresas em todo o mundo
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
              <div key={index} className="flex gap-8 md:gap-12 min-w-max px-4">
                {companies.map((company) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="group flex items-center justify-center gap-3 px-6 py-4 rounded-lg border border-border/20 bg-card/30 hover:bg-card/60 transition-all duration-300 cursor-pointer hover:border-primary/50"
                  >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-semibold text-primary/80 group-hover:text-primary transition-colors">
                      {company.logo}
                    </div>
                    <span className="text-foreground font-medium text-sm group-hover:text-primary transition-colors whitespace-nowrap">
                      {company.name}
                    </span>
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
