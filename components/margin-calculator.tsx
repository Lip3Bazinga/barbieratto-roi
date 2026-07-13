"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  Loader2,
  Lock,
  CheckCircle2,
  CalendarCheck,
  TrendingDown,
} from "lucide-react"

// Premissas fixas do briefing
const MARKETPLACE_COST = 0.35 // 35%
const OWN_ECOMMERCE_COST = 0.23 // 23%
const DIFFERENCE = MARKETPLACE_COST - OWN_ECOMMERCE_COST // 12 pontos percentuais

const marketplaces = [
  { id: "mercado-livre", label: "Mercado Livre" },
  { id: "shopee", label: "Shopee" },
  { id: "amazon", label: "Amazon" },
  { id: "magalu", label: "Magalu" },
  { id: "tiktok-shop", label: "TikTok Shop" },
  { id: "outro", label: "Outro" },
]

const niches = [
  { id: "moda", label: "Moda e acessórios" },
  { id: "beleza", label: "Beleza" },
  { id: "casa", label: "Casa e decoração" },
  { id: "eletronicos", label: "Eletrônicos" },
  { id: "infantil", label: "Infantil" },
  { id: "alimentos", label: "Alimentos" },
  { id: "pet", label: "Pet" },
  { id: "autopecas", label: "Autopeças" },
  { id: "outro", label: "Outro" },
]

const processingMessages = [
  "Analisando seu faturamento...",
  "Comparando os custos do marketplace com uma operação própria...",
  "Calculando sua margem potencial...",
  "Preparando seu diagnóstico...",
]

type Step =
  | "marketplace"
  | "revenue"
  | "niche"
  | "processing"
  | "preview"
  | "capture"
  | "diagnosis"

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

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

const STEP_ORDER: Step[] = ["marketplace", "revenue", "niche"]

export function MarginCalculator() {
  const [step, setStep] = useState<Step>("marketplace")

  // Form state
  const [marketplace, setMarketplace] = useState("")
  const [marketplaceOther, setMarketplaceOther] = useState("")
  const [revenue, setRevenue] = useState("")
  const [revenueError, setRevenueError] = useState("")
  const [niche, setNiche] = useState("")
  const [nicheOther, setNicheOther] = useState("")

  // Lead capture
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Processing
  const [processingIndex, setProcessingIndex] = useState(0)

  const revenueValue = parseCurrency(revenue)
  const annualDifference = revenueValue * DIFFERENCE
  const monthlyDifference = annualDifference / 12

  // Processing animation
  useEffect(() => {
    if (step !== "processing") return
    setProcessingIndex(0)
    const interval = setInterval(() => {
      setProcessingIndex((prev) => {
        if (prev >= processingMessages.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 900)

    const timeout = setTimeout(() => {
      setStep("preview")
    }, 3600)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [step])

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRevenue(formatCurrency(e.target.value))
    setRevenueError("")
  }

  const validateRevenue = (): boolean => {
    if (revenueValue <= 0) {
      setRevenueError("Informe um faturamento válido maior que zero.")
      return false
    }
    if (revenueValue < 10000) {
      setRevenueError(
        "Confira se você informou o faturamento total dos últimos 12 meses, e não apenas o faturamento de um mês."
      )
      return false
    }
    return true
  }

  const goNext = () => {
    if (step === "marketplace") setStep("revenue")
    else if (step === "revenue") {
      if (validateRevenue()) setStep("niche")
    } else if (step === "niche") setStep("processing")
  }

  const goBack = () => {
    if (step === "revenue") setStep("marketplace")
    else if (step === "niche") setStep("revenue")
  }

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("diagnosis")
  }

  const canProceedMarketplace =
    marketplace && (marketplace !== "outro" || marketplaceOther.trim())
  const canProceedNiche = niche && (niche !== "outro" || nicheOther.trim())
  const canSubmitLead = name.trim() && email.trim() && whatsapp.trim()

  const currentStepIndex = STEP_ORDER.indexOf(step)

  return (
    <Card className="w-full max-w-2xl border-border bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Progress bar for the 3 input steps */}
      {currentStepIndex >= 0 && (
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Calculadora de margem
            </span>
          </div>
          <div className="flex gap-2">
            {STEP_ORDER.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= currentStepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <CardContent className="p-6 md:p-8">
        {/* STEP 1: Marketplace */}
        {step === "marketplace" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground text-balance">
                Em qual marketplace sua empresa concentra a maior parte das
                vendas?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {marketplaces.map((mp) => (
                <button
                  key={mp.id}
                  type="button"
                  onClick={() => setMarketplace(mp.id)}
                  className={`flex items-center justify-center rounded-lg border-2 p-4 text-sm font-semibold transition-all ${
                    marketplace === mp.id
                      ? "border-primary bg-primary/10 text-foreground shadow-md"
                      : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {mp.label}
                </button>
              ))}
            </div>
            {marketplace === "outro" && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label htmlFor="marketplace-other" className="text-foreground font-medium">
                  Qual marketplace?
                </Label>
                <input
                  id="marketplace-other"
                  type="text"
                  value={marketplaceOther}
                  onChange={(e) => setMarketplaceOther(e.target.value)}
                  placeholder="Digite o nome do marketplace"
                  className="flex h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm"
                />
              </div>
            )}
            <Button
              onClick={goNext}
              disabled={!canProceedMarketplace}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Continuar
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2: Faturamento */}
        {step === "revenue" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground text-balance">
                Quanto sua empresa faturou nos marketplaces nos últimos 12
                meses?
              </h2>
              <p className="text-sm text-muted-foreground">
                Considere o valor total das vendas antes do desconto de taxas,
                comissões, anúncios e frete.
              </p>
            </div>
            <div className="space-y-2">
              <input
                id="revenue"
                type="text"
                inputMode="numeric"
                value={revenue}
                onChange={handleRevenueChange}
                placeholder="R$ 0,00"
                className={`flex h-16 w-full rounded-lg border-2 bg-white px-4 py-2 text-2xl font-bold text-foreground placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm ${
                  revenueError ? "border-destructive" : "border-border"
                }`}
              />
              {revenueError && (
                <p className="text-sm text-destructive animate-in fade-in duration-300">
                  {revenueError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={goBack}
                variant="outline"
                size="lg"
                className="h-14 px-6 border-2 border-border text-foreground hover:bg-secondary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={goNext}
                size="lg"
                className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Continuar
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Nicho */}
        {step === "niche" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground text-balance">
                Qual é a principal categoria dos produtos que você vende?
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {niches.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNiche(n.id)}
                  className={`flex items-center justify-center rounded-lg border-2 p-3 text-sm font-semibold text-center transition-all ${
                    niche === n.id
                      ? "border-primary bg-primary/10 text-foreground shadow-md"
                      : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            {niche === "outro" && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label htmlFor="niche-other" className="text-foreground font-medium">
                  Qual categoria?
                </Label>
                <input
                  id="niche-other"
                  type="text"
                  value={nicheOther}
                  onChange={(e) => setNicheOther(e.target.value)}
                  placeholder="Digite a categoria dos seus produtos"
                  className="flex h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm"
                />
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={goBack}
                variant="outline"
                size="lg"
                className="h-14 px-6 border-2 border-border text-foreground hover:bg-secondary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={goNext}
                disabled={!canProceedNiche}
                size="lg"
                className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Analisar meu potencial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Processamento */}
        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <p className="text-lg font-medium text-foreground animate-in fade-in duration-500" key={processingIndex}>
              {processingMessages[processingIndex]}
            </p>
            <div className="flex gap-2">
              {processingMessages.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i <= processingIndex ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Prévia do resultado */}
        {step === "preview" && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500 py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Seu diagnóstico está pronto
            </div>
            <p className="text-muted-foreground text-base max-w-md mx-auto text-pretty">
              Identificamos uma diferença relevante entre o custo médio do
              marketplace e o custo estimado de uma operação própria.
            </p>
            <div className="py-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Sua empresa poderia ter preservado mais de:
              </p>
              <div className="relative flex items-center justify-center">
                <p className="text-4xl md:text-5xl font-bold text-primary select-none">
                  R$ 1
                  <span className="blur-[6px]">••.•••</span>
                  ,00
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/5 border border-border p-4 flex items-center gap-3 justify-center">
              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground text-left">
                Preencha seus dados para acessar o valor completo e receber seu
                diagnóstico personalizado.
              </p>
            </div>
            <Button
              onClick={() => setStep("capture")}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Revelar valor completo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 6: Captura de lead */}
        {step === "capture" && (
          <form
            onSubmit={handleSubmitLead}
            className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-400"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Falta pouco para o seu diagnóstico
              </h2>
              <p className="text-sm text-muted-foreground">
                Preencha seus dados para acessar o valor completo.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Nome
              </Label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="flex h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                E-mail
              </Label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="flex h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-foreground font-medium">
                WhatsApp
              </Label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
                required
                className="flex h-12 w-full rounded-lg border-2 border-border bg-white px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={!canSubmitLead}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Ver meu diagnóstico completo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>
        )}

        {/* STEP 7: Diagnóstico completo */}
        {step === "diagnosis" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Seu diagnóstico está pronto
              </div>
              <p className="text-muted-foreground text-base text-pretty">
                <span className="font-semibold text-foreground">
                  {name.split(" ")[0] || "Olá"}
                </span>
                , com base no faturamento informado dos últimos 12 meses, sua
                empresa poderia ter gerado aproximadamente:
              </p>
            </div>

            {/* Annual value */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <TrendingDown className="h-5 w-5" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  A mais no último ano
                </span>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                {formatBRL(annualDifference)}
              </p>
            </div>

            {/* Monthly value */}
            <div className="rounded-xl border border-border bg-secondary/5 p-5 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Isso representa cerca de:
              </p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                {formatBRL(monthlyDifference)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                a mais por mês dentro da operação
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center text-pretty">
              Com um canal próprio, esse valor poderia ser utilizado para
              aumentar o lucro, reinvestir em aquisição de clientes, ampliar o
              estoque ou acelerar o crescimento da empresa.
            </p>

            {/* Victor block */}
            <div className="rounded-xl border border-border bg-white p-5 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary/20">
                <Image
                  src="/victor-specialist.png"
                  alt="Victor - Especialista em e-commerce"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <p className="text-sm text-muted-foreground text-pretty">
                Há mais de 15 anos desenvolvemos estratégias para e-commerces de
                diferentes nichos, com operações que juntas já ultrapassaram{" "}
                <span className="font-semibold text-foreground">
                  R$ 500 milhões
                </span>{" "}
                em faturamento — ajudando empresas a crescer sem depender
                exclusivamente de marketplaces e a aumentar suas margens.
              </p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground text-pretty">
                Para entender como essa estratégia pode ser aplicada ao seu
                negócio, agende uma reunião sem compromisso com um dos nossos
                especialistas.
              </p>
              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <CalendarCheck className="h-5 w-5 mr-2" />
                Quero agendar uma reunião
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
