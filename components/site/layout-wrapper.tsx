'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { PageTransition } from './page-transition';

export function LayoutWrapper({
  children,
  siteConfig,
}: {
  children: React.ReactNode;
  siteConfig: any;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar siteConfig={siteConfig} />
      <PageTransition>
        <main className="flex-1">{children}</main>
      </PageTransition>
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
