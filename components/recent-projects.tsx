"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, ArrowUpRight } from "lucide-react"

const caseStudies = [
  {
    company: "TechStart SaaS",
    industry: "Software",
    beforeRoi: "R$ 45.000",
    afterRoi: "R$ 180.000",
    growth: "+300%",
    beforeText: "Investimento sem ROI claro",
    afterText: "3.5x retorno em mídia",
  },
  {
    company: "E-commerce Fashion",
    industry: "E-commerce",
    beforeRoi: "R$ 30.000",
    afterRoi: "R$ 150.000",
    growth: "+400%",
    beforeText: "Conversão baixa",
    afterText: "Crescimento em vendas",
  },
  {
    company: "Agência Digital",
    industry: "Serviços",
    beforeRoi: "R$ 25.000",
    afterRoi: "R$ 125.000",
    growth: "+380%",
    beforeText: "Leads de baixa qualidade",
    afterText: "Qualificação premium",
  },
  {
    company: "Educação Online",
    industry: "EdTech",
    beforeRoi: "R$ 35.000",
    afterRoi: "R$ 175.000",
    growth: "+390%",
    beforeText: "Alto CAC",
    afterText: "Aquisição otimizada",
  },
  {
    company: "Consultoria B2B",
    industry: "Consultoria",
    beforeRoi: "R$ 20.000",
    afterRoi: "R$ 110.000",
    growth: "+450%",
    beforeText: "Sem estratégia",
    afterText: "Escalável sistemática",
  },
  {
    company: "Health & Wellness",
    industry: "Saúde",
    beforeRoi: "R$ 40.000",
    afterRoi: "R$ 160.000",
    growth: "+300%",
    beforeText: "Baixa retenção",
    afterText: "Crescimento sustentável",
  },
]

export function RecentProjects() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-card/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Casos de sucesso
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Projetos recentes e resultados
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja como empresas reais escalaram seus negócios com nossa metodologia
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${
                hoveredIndex === index
                  ? "border-primary/60 shadow-2xl scale-105"
                  : "border-primary/10 shadow-lg"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
                background:
                  "linear-gradient(135deg, rgba(21, 128, 61, 0.05) 0%, rgba(21, 128, 61, 0.02) 100%)",
              }}
            >
              {/* Glowing Border Effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none ${
                  hoveredIndex === index
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
                }}
              />

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col space-y-6">
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {study.company}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {study.industry}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Growth Badge */}
                <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{study.growth}</span>
                </div>

                {/* Before & After */}
                <div className="flex-1 space-y-4">
                  {/* Before */}
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Antes
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-2">
                      {study.beforeRoi}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {study.beforeText}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-primary rotate-45" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs uppercase tracking-wider text-primary mb-1">
                      Depois
                    </p>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {study.afterRoi}
                    </p>
                    <p className="text-sm text-foreground">
                      {study.afterText}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Shine */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    hoveredIndex === index ? "opacity-100" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                    transform: "translateX(-100%) translateY(-100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
