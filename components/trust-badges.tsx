import { Shield, Award, Clock, Users } from "lucide-react"

const badges = [
  {
    icon: Shield,
    title: "Segurança garantida",
    description: "Seus dados estão protegidos",
  },
  {
    icon: Award,
    title: "Certificação Google",
    description: "Agência parceira Premier",
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Sempre disponíveis para você",
  },
  {
    icon: Users,
    title: "+500 clientes",
    description: "Empresas de diversos setores",
  },
]

export function TrustBadges() {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-8">
          Por que confiar em nós
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
