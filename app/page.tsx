import { HeroSection } from "@/components/hero-section"
import { TrustBadges } from "@/components/trust-badges"
import { TrustedByMarquee } from "@/components/trusted-by-marquee"
import { OurImpact } from "@/components/our-impact"
import { CertificationsRow } from "@/components/certifications-row"
import { RecentProjects } from "@/components/recent-projects"
import { ClientTestimonials } from "@/components/client-testimonials"
import { IroncladGuarantee } from "@/components/ironclad-guarantee"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <TrustBadges />
      <TrustedByMarquee />
      <OurImpact />
      <CertificationsRow />
      <RecentProjects />
      <ClientTestimonials />
      <IroncladGuarantee />
      <Footer />
    </main>
  )
}
