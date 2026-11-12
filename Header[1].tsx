'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { Menu, X, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { getAuth } from '@/lib/firebase'

export function Header() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(getAuth())
      setMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('[AZIBO] Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 group">
          <div className="px-3 py-2 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">
            <span className="text-sm">AZIBO STUDIO</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">
              Create Viral AI Videos
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>

          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>

          <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Support
          </Link>

          {user ? (
            <div className="flex items-center gap-4">

              <Link
                href="/create"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Sparkles size={16} />
                Create Video
              </Link>

              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>

              {profile?.role === 'owner' && (
                <Link href="/admin" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">

            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>

            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>

            <Link href="/support" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              Support
            </Link>

            {user ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Sparkles size={17} />
                  Create Video
                </Link>

                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>

                {profile?.role === 'owner' && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-primary font-medium">
                    Admin
                  </Link>
                )}

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    {user.email}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80 flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-center text-sm text-muted-foreground">
                  Login
                </Link>

                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}