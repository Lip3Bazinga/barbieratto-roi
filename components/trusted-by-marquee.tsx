"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const companies = [
  { name: "Irroba", logo: "/logos/irroba.jpg" },
  { name: "Shoppub", logo: "/logos/shoppub.jpg" },
  { name: "VTEX", logo: "/logos/vtex.jpg" },
  { name: "Nuvemshop", logo: "/logos/nuvemshop.jpg" },
  { name: "SoftUp ERP", logo: "/logos/softup-erp.jpg" },
  { name: "Bling7", logo: "/logos/bling.jpg" },
  { name: "Olist", logo: "/logos/olist.jpg" },
  { name: "Pagar.me", logo: "/logos/pagar-me.jpg" },
  { name: "Mercado Pago", logo: "/logos/mercado-pago.jpg" },
  { name: "PayPal", logo: "/logos/paypal.jpg" },
  { name: "RD Station", logo: "/logos/rd-station.jpg" },
  { name: "Flowbiz", logo: "/logos/flowbiz.jpg" },
  { name: "Revi", logo: "/logos/revi.jpg" },
  { name: "Martz", logo: "/logos/martz.jpg" },
  { name: "CartStack", logo: "/logos/cartstack.jpg" },
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
                    className="group relative flex items-center justify-center px-6 py-4 rounded-lg border border-border/40 bg-white hover:bg-white transition-all duration-300 cursor-pointer hover:border-primary/60 hover:shadow-lg min-w-max overflow-hidden grayscale hover:grayscale-0"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={120}
                      height={50}
                      className="object-contain h-12 w-auto"
                    />
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
