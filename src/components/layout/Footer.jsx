export default function Footer({ left }) {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="max-w-[1440px] mx-auto px-8 h-10 flex items-center justify-between">
        <span className="font-mono text-xs text-text-dim uppercase tracking-widest-2">
          {left || '© 2026 Figlog'}
        </span>
        <div className="flex items-center gap-6">
          <a href="#" className="font-mono text-xs text-text-muted hover:text-text-primary uppercase tracking-widest-2 transition-colors">
            Documentation
          </a>
          <a href="#" className="font-mono text-xs text-text-muted hover:text-text-primary uppercase tracking-widest-2 transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
