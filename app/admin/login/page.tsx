'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful login
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden px-4">
      {/* Dynamic background pattern matching Hero */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#8080800b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/8 to-orange-500/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px]"
      >
        <Card className="border-border/60 bg-background/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20 mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="font-display text-2xl font-bold tracking-tight">Admin Console</CardTitle>
            <CardDescription>
              Enter password to manage TectoFlow website content.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="popLayout">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <Alert variant="destructive" className="bg-destructive/5 dark:bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400 rounded-xl">
                      <AlertCircle className="h-4 w-4 text-destructive dark:text-red-400" />
                      <AlertTitle className="font-semibold text-destructive dark:text-red-400">Error</AlertTitle>
                      <AlertDescription className="text-destructive/95 dark:text-red-300/90 font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-accent"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-accent to-orange-500 hover:opacity-95 font-semibold transition-all duration-300 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
