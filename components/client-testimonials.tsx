"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marina Silva",
    role: "CEO",
    company: "TechStart SaaS",
    content:
      "A metodologia deles nos ajudou a triplicar nosso faturamento em apenas 6 meses. ROI extraordinário!",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "Carlos Eduardo",
    role: "Diretor Comercial",
    company: "E-commerce Fashion",
    content:
      "Profissionalismo e resultados reais. Superaram todas as nossas expectativas com estratégia clara.",
    rating: 5,
    avatar: "CE",
  },
  {
    name: "Beatriz Costa",
    role: "Sócia-Diretora",
    company: "Agência Digital",
    content:
      "O melhor investimento que fizemos. Não é só consultoria, é parceria genuína com resultados comprovados.",
    rating: 5,
    avatar: "BC",
  },
  {
    name: "Felipe Santos",
    role: "Fundador",
    company: "Educação Online",
    content:
      "Escalamos de forma sustentável. A metodologia é replicável e funcionou perfeitamente para nosso modelo.",
    rating: 5,
    avatar: "FS",
  },
  {
    name: "Juliana Pereira",
    role: "Diretora de Marketing",
    company: "Consultoria B2B",
    content:
      "Equipe excelente, estratégia bem fundamentada e suporte incrível. Voltamos a crescer com autoridade.",
    rating: 5,
    avatar: "JP",
  },
  {
    name: "Roberto Alves",
    role: "Proprietário",
    company: "Health & Wellness",
    content:
      "Os números falam: 400% de crescimento em leads qualificados. Mais do que esperávamos!",
    rating: 5,
    avatar: "RA",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-primary text-primary"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  )
}

export function ClientTestimonials() {
  const [isVisible, setIsVisible] = useState(false)
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
    <section ref={sectionRef} className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Depoimentos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground text-lg">
            Histórias reais de empreendedores que transformaram seus negócios
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                animation: isVisible ? `float ${3 + index * 0.2}s ease-in-out infinite` : "none",
              }}
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl border border-border/30 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 backdrop-blur-sm">
                {/* Quote Mark */}
                <div className="absolute -top-4 -left-2 text-6xl text-primary/10 font-serif">
                  "
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Text */}
                  <p className="text-foreground leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Author */}
                  <div className="pt-4 border-t border-border/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-bold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.08) 0%, transparent 70%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  )
}
