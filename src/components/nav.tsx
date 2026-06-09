'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Nuevo' },
  { href: '/history', label: 'Historial' },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center px-4 sm:px-8">
        <Link href="/" className="font-bold text-lg mr-6">
          ⏳ ChronoZ
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-foreground ${
                pathname === href
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
