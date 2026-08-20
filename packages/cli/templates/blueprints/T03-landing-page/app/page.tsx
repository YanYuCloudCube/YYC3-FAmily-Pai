import { CTASection } from "@/components/sections/cta"
import { FeaturesSection } from "@/components/sections/features"
import { HeroSection } from "@/components/sections/hero"
import { PricingSection } from "@/components/sections/pricing"
import { StatsSection } from "@/components/sections/stats"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <CTASection />
    </div>
  )
}
