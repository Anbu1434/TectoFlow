'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to console/monitoring tool
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden px-4 py-16">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#8080800b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/8 to-orange-500/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] text-center space-y-6"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-4 animate-pulse">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
          An unexpected error occurred during rendering. We apologize for the inconvenience. Our team has been notified.
        </p>

        {error.digest && (
          <div className="bg-card/45 border border-border/80 px-4 py-2.5 rounded-xl font-mono text-xs text-muted-foreground inline-block">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-11 rounded-full bg-accent hover:opacity-95 font-semibold transition-all duration-300 gap-2 shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-11 rounded-full font-semibold transition-all duration-300 gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Back Home</span>
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
