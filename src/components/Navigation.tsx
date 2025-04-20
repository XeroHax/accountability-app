import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="flex items-center justify-center space-x-16">
      <Link
        href="/"
        className="text-foreground/70 hover:text-foreground transition-colors font-bold"
      >
        Home
      </Link>
      <Link
        href="/articles"
        className="text-foreground/70 hover:text-foreground transition-colors font-bold"
      >
        Articles
      </Link>
      <Link
        href="/privacy"
        className="text-foreground/70 hover:text-foreground transition-colors font-bold"
      >
        Privacy
      </Link>
      <Link
        href="/terms"
        className="text-foreground/70 hover:text-foreground transition-colors font-bold"
      >
        Terms
      </Link>
    </nav>
  )
}

export default Navigation
