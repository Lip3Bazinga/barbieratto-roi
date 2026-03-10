"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react"

const niches = [
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS / Software" },
  { value: "education", label: "Educação / Infoprodutos" },
  { value: "services", label: "Serviços Profissionais" },
  { value: "healthcare", label: "Saúde / Bem-estar" },
  { value: "real-estate", label: "Imobiliário" },
  { value: "finance", label: "Finanças / Investimentos" },
  { value: "retail", label: "Varejo" },
  { value: "other", label: "Outro" },
]

const channels = [
  { id: "meta", label: "Meta Ads (Facebook/Instagram)" },
  { id: "google", label: "Google Ads" },
  { id: "tiktok", label: "TikTok Ads" },
  { id: "seo", label: "SEO / Orgânico" },
  { id: "linkedin", label: "LinkedIn Ads" },
  { id: "email", label: "E-mail Marketing" },
]

function formatCurrency(value: string): string {
  const numericValue = value.replace(/\D/g, "")
  if (!numericValue) return ""
  const number = parseInt(numericValue, 10)
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(number / 100)
}

function parseCurrency(value: string): number {
  const numericValue = value.replace(/\D/g, "")
  return parseInt(numericValue, 10) / 100 || 0
}

export function RoiCalculator() {
  const [niche, setNiche] = useState("")
  const [investment, setInvestment] = useState("")
  const [revenue, setRevenue] = useState("")
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [calculatedRoi, setCalculatedRoi] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setInvestment(formatted)
  }

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setRevenue(formatted)
  }

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    )
  }

  const calculateRoi = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const investmentValue = parseCurrency(investment)
      const revenueValue = parseCurrency(revenue)
      
      // Simulated ROI calculation based on methodology
      const channelMultiplier = 1 + (selectedChannels.length * 0.15)
      const nicheMultiplier = niche === "saas" ? 1.4 : niche === "ecommerce" ? 1.3 : 1.2
      const baseMultiplier = 2.5
      
      const projectedReturn = (investmentValue * baseMultiplier * channelMultiplier * nicheMultiplier) + (revenueValue * 0.3)
      
      setCalculatedRoi(Math.round(projectedReturn))
      setIsCalculating(false)
      setShowResult(true)
    }, 1500)
  }

  const isFormValid = niche && investment && revenue && selectedChannels.length > 0

  return (
    <Card className="w-full max-w-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Calculadora de ROI
          </span>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold text-balance">
          Descubra seu potencial de retorno
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Preencha os dados abaixo e veja quanto você pode escalar seus resultados
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {/* Niche Select */}
        <div className="space-y-2">
          <Label htmlFor="niche" className="text-foreground font-medium">
            Nicho
          </Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger id="niche" className="bg-input border-border h-12">
              <SelectValue placeholder="Selecione seu nicho de atuação" />
            </SelectTrigger>
            <SelectContent>
              {niches.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Investment Input */}
        <div className="space-y-2">
          <Label htmlFor="investment" className="text-foreground font-medium">
            Investimento por mês em mídia
          </Label>
          <input
            id="investment"
            type="text"
            value={investment}
            onChange={handleInvestmentChange}
            placeholder="R$ 0,00"
            className="flex h-12 w-full rounded-lg border border-border bg-input px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          />
        </div>

        {/* Revenue Input */}
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-foreground font-medium">
            Faturamento médio mensal
          </Label>
          <input
            id="revenue"
            type="text"
            value={revenue}
            onChange={handleRevenueChange}
            placeholder="R$ 0,00"
            className="flex h-12 w-full rounded-lg border border-border bg-input px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          />
        </div>

        {/* Channels Checkboxes */}
        <div className="space-y-3">
          <Label className="text-foreground font-medium">
            Canais de aquisição explorados
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  selectedChannels.includes(channel.id)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-input/50 hover:border-primary/50"
                }`}
                onClick={() => toggleChannel(channel.id)}
              >
                <Checkbox
                  id={channel.id}
                  checked={selectedChannels.includes(channel.id)}
                  onCheckedChange={() => toggleChannel(channel.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={channel.id}
                  className="text-sm font-medium cursor-pointer text-foreground"
                >
                  {channel.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={calculateRoi}
          disabled={!isFormValid || isCalculating}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
          size="lg"
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              Calculando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Calcular meu Retorno
              <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </Button>

        {/* Result Section */}
        {showResult && (
          <div className="mt-8 pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
                  Retorno que poderia ter obtido com a nossa metodologia:
                </p>
              </div>
              
              <div className="py-6">
                <p className="text-5xl md:text-6xl font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  }).format(calculatedRoi)}
                </p>
                <p className="text-muted-foreground mt-2">
                  em potencial de faturamento mensal
                </p>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
              >
                <span className="flex items-center gap-2">
                  Quero esse resultado
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
