import Image from "next/image"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/logos/barbieratto-header.png"
                alt="Barbieratto"
                width={140}
                height={50}
                className="h-10 w-auto object-contain relative z-10"
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

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre nós
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Serviços
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cases de sucesso
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Barbieratto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
