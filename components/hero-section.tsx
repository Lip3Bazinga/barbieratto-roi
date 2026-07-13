import { ArrowDown, TrendingUp, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[600px] bg-primary/5 blur-3xl rounded-full" />

      <div className="relative container mx-auto px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-16">
          <div
            className="relative flex items-center justify-center px-6 py-3 rounded-lg"
            style={{
              background: "linear-gradient(90deg, #000000, #2a2a2a, #111111, #3a3a3a, #000000)",
              backgroundSize: "300% 100%",
              animation: "logo-gradient-sweep 4s ease-in-out infinite",
            }}
          >
            <Image
              src="/logos/barbieratto-header.png"
              alt="Barbieratto"
              width={140}
              height={50}
              className="h-10 w-auto object-contain relative z-10"
            />
          </div>

          <style>{`
            @keyframes logo-gradient-sweep {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>

        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Diagnóstico gratuito em menos de 1 minuto</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Descubra quanto dinheiro você{" "}
            <span className="text-primary">perdeu nos últimos 12 meses</span>{" "}
            por vender em marketplaces
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Informe seu faturamento nos marketplaces e descubra quanto da sua
            margem pode estar sendo consumida pelas taxas e pelos custos do
            canal.
          </p>

          <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
            A análise utiliza uma estrutura média de custos para comparar
            marketplaces e e-commerce próprio.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value="15+"
            label="Anos de experiência"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            value="R$ 500M+"
            label="Gerenciados em faturamento"
          />
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            value="12%"
            label="Margem média recuperável"
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
              <span className="text-sm font-medium">Calcular meu potencial</span>
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
