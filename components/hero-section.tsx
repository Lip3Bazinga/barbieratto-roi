import { ArrowDown, TrendingUp, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 blur-3xl rounded-full" />
      
      <div className="relative container mx-auto px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-16">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/logos/barbieratto-header.png"
              alt="Barbieratto"
              width={140}
              height={50}
              className="h-12 w-auto object-contain relative z-10"
            />
            {/* Animated Gradient Overlay */}
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)",
                animation: "gradient-shimmer 3s ease-in-out infinite",
              }}
            />
          </div>

          <style>{`
            @keyframes gradient-shimmer {
              0% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}</style>
        </div>

        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Metodologia comprovada por +500 empresas</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Escale seu negócio e{" "}
            <span className="text-primary">maximize seu ROI</span>{" "}
            com marketing de performance
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubra quanto sua empresa pode faturar utilizando estratégias 
            inteligentes de aquisição. Calcule seu potencial de retorno agora.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value="3.5x"
            label="ROI médio dos clientes"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            value="R$ 50M+"
            label="Gerenciados em mídia"
          />
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            value="+180%"
            label="Crescimento médio"
          />
        </div>

        {/* CTA Arrow */}
        <div className="flex justify-center mt-16">
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-primary group"
            asChild
          >
            <a href="#calculator" className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Calcular meu retorno</span>
              <ArrowDown className="h-5 w-5 animate-bounce" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  )
}
