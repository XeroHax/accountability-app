import Image from 'next/image'
import Link from 'next/link'
import Navigation from './Navigation'
import HamburgerMenu from './HamburgerMenu'
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full pt-6 pb-4 px-[5%] flex items-center justify-between bg-background z-40">
      {/* Logo */}
      <Link href="/">
        <div className="shrink-0 w-[160px] sm:w-[180px] md:w-[200px] h-[30px] relative">
          <Image
            src="/accountability-logo.svg"
            alt="Accountability Logo"
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:block flex-grow text-center">
        <Navigation />
      </div>

      {/* Sign Up Button - Desktop Only */}
      <div className="hidden lg:block font-bold">
        <Link href="/signup">
          <Button size="lg">
            Become A Member
          </Button>
        </Link>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="block lg:hidden">
        <HamburgerMenu />
      </div>
    </header>
  )
}

export default Header
