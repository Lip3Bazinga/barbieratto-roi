import { ArrowRight, Zap, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MarginCalculator } from "@/components/margin-calculator"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="relative container mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-20">
        {/* Header with Logo */}
        <div className="flex items-center justify-center lg:justify-start mb-12">
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

        {/* Lateral two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: Marketing content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Diagnóstico gratuito em menos de 1 minuto</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-tight text-balance">
              Descubra quanto dinheiro você{" "}
              <span className="text-primary">perdeu nos últimos 12 meses</span>{" "}
              por vender em marketplaces
            </h1>

            {/* Subtitle - larger font per feedback */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mt-6 text-pretty leading-relaxed">
              Informe seu faturamento nos marketplaces e descubra quanto da sua
              margem pode estar sendo consumida pelas taxas e pelos custos do
              canal.
            </p>

            {/* Secondary note - increased size per feedback */}
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl mt-4">
              A análise utiliza uma estrutura média de custos para comparar
              marketplaces e e-commerce próprio.
            </p>

            {/* Green CTA button below the text */}
            <Button
              size="lg"
              className="mt-8 h-14 px-8 text-base font-semibold bg-success text-success-foreground hover:bg-success/90 shadow-lg shadow-success/20 group"
              asChild
            >
              <a href="#calculator" className="flex items-center gap-2">
                Começar a análise
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>

            {/* Company logos below the button */}
            <div className="mt-8 flex flex-col items-center lg:items-start gap-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground/70">
                Uma iniciativa
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center px-5 py-3 rounded-lg bg-[#0a0a0a]">
                  <Image
                    src="/logos/barbieratto-header.png"
                    alt="Barbieratto"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-center px-5 py-3 rounded-lg bg-[#0a0a0a]">
                  <Image
                    src="/logos/ecommerce-12x.png"
                    alt="E-commerce 12X"
                    width={150}
                    height={40}
                    className="h-6 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Calculator */}
          <div id="calculator" className="w-full flex justify-center lg:justify-end scroll-mt-24">
            <MarginCalculator />
          </div>
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
