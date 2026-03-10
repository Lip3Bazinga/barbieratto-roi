import Image from "next/image"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
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
