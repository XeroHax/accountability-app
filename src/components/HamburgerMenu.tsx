'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-accent rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block w-6 h-0.5 bg-foreground rounded-full transition-transform ${
            isOpen ? 'rotate-45 translate-y-2.5' : ''
          }`} />
          <span className={`block w-6 h-0.5 bg-foreground rounded-full transition-opacity ${
            isOpen ? 'opacity-0' : ''
          }`} />
          <span className={`block w-6 h-0.5 bg-foreground rounded-full transition-transform ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`} />
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
          style={{ top: '92px' }}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`
          fixed left-0 right-0 top-[92px] bg-background shadow-lg z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : '-translate-y-[150%]'}
        `}
      >
        <nav className="flex flex-col py-2">
          <Link
            href="/"
            className="px-[5%] py-4 text-foreground/70 hover:bg-accent transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="px-[5%] py-4 text-foreground/70 hover:bg-accent transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/privacy"
            className="px-[5%] py-4 text-foreground/70 hover:bg-accent transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="px-[5%] py-4 text-foreground/70 hover:bg-accent transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Terms
          </Link>

          {/* Sign Up Button */}
          <div className="px-[5%] py-6 border-t border-border mt-2">
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button size="lg" className="w-full">
                Become A Member
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default HamburgerMenu
