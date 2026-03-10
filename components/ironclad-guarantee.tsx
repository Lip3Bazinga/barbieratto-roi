"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function IroncladGuarantee() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0" />

      <div className="container relative mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Card - Polished Metal Effect */}
          <div className="relative group rounded-2xl overflow-hidden border-2 border-primary/60 hover:border-primary/100 transition-all duration-500 shadow-2xl">
            {/* Metallic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />

            {/* Chrome/Metallic Shine */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              {/* Top Section with Shield */}
              <div className="flex items-start justify-between mb-12">
                <div className="flex-1">
                  <p className="text-primary text-sm uppercase tracking-widest mb-4 font-bold">
                    Garantia de resultados
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Garantia de Resultados ou seu Dinheiro de Volta
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Se você não atingir pelo menos 2.5x de retorno no primeiro semestre, devolvemos 100% do investimento. Confiamos em nossa metodologia.
                  </p>
                </div>

                {/* 3D Metal Shield Icon */}
                <div className="relative hidden md:flex items-center justify-center flex-shrink-0">
                  <div className="relative w-32 h-32">
                    {/* Metal Shield with 3D Effect */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-white to-gray-100 shadow-2xl flex items-center justify-center"
                      style={{
                        boxShadow: "inset -2px -2px 5px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.8), 0 10px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Shield className="w-20 h-20 text-primary" />
                    </div>

                    {/* Shine Effect */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                        animation: "shine 3s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pt-8 border-t-2 border-primary/20">
                {[
                  {
                    icon: <CheckCircle className="w-6 h-6" />,
                    title: "100% Garantido",
                    description: "Sem risco. Se não funcionar, devolvemos tudo.",
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "2.5x Mínimo",
                    description: "Objetivo: 2.5x de retorno em 6 meses.",
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Suporte Total",
                    description: "Equipe dedicada para alcançar seus resultados.",
                  },
                ].map((point, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 border-primary/20 bg-white hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group/item shadow-md hover:shadow-lg ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-primary group-hover/item:scale-110 transition-transform duration-300">
                        {point.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {point.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Iniciar Agora - Sem Risco
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 border-primary/40 text-foreground hover:border-primary/80 hover:bg-white transition-all"
                >
                  Falar com Especialista
                </Button>
              </div>

              {/* Fine Print */}
              <p className="text-center text-xs text-muted-foreground mt-8">
                Garantia válida para clientes que implementarem totalmente a metodologia e seguirem as recomendações da equipe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shine {
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
