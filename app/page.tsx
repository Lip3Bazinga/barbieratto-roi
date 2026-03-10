import { HeroSection } from "@/components/hero-section"
import { RoiCalculator } from "@/components/roi-calculator"
import { TrustBadges } from "@/components/trust-badges"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Calculator Section */}
      <section id="calculator" className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 flex flex-col items-center">
          <RoiCalculator />
        </div>
      </section>

      <TrustBadges />
      <Footer />
    </main>
  )
}
