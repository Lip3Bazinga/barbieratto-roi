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
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-3xl rounded-full" />

      <div className="container relative mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Card */}
          <div className="relative group rounded-3xl overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-all duration-500">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-card" />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              {/* Top Section with Shield */}
              <div className="flex items-start justify-between mb-12">
                <div className="flex-1">
                  <p className="text-primary text-sm uppercase tracking-widest mb-4">
                    Garantia de resultados
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Garantia de Resultados ou seu Dinheiro de Volta
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Se você não atingir pelo menos 2.5x de retorno no primeiro semestre, devolvemos 100% do investimento. Confiamos em nossa metodologia.
                  </p>
                </div>

                {/* 3D Shield Icon */}
                <div className="relative hidden md:flex items-center justify-center flex-shrink-0">
                  <div className="relative w-32 h-32">
                    {/* Outer Glow */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-2xl"
                      style={{
                        animation: "pulse 3s ease-in-out infinite",
                      }}
                    />

                    {/* Shield */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-24 h-24 text-primary drop-shadow-lg" />
                    </div>

                    {/* Shine Effect */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pt-8 border-t border-border/30">
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
                    className={`p-6 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group/item ${
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
                  className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Iniciar Agora - Sem Risco
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-primary/30 hover:border-primary/60 hover:bg-card/80 transition-all"
                >
                  Falar com Especialista
                </Button>
              </div>

              {/* Fine Print */}
              <p className="text-center text-xs text-muted-foreground mt-8">
                Garantia válida para clientes que implementarem totalmente a metodologia e seguirem as recomendações da equipe.
              </p>
            </div>

            {/* Border Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at top right, rgba(34, 197, 94, 0.2) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </section>
  )
}
