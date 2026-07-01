import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/container';

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center pt-32 pb-16 sm:pt-40 sm:pb-20">
      <span className="font-display text-8xl font-bold text-accent/20 sm:text-9xl">
        404
      </span>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        This page took a wrong turn
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you
        back on track.
      </p>
      <div className="flex gap-3">
        <Button asChild className="rounded-full">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/work">View our work</Link>
        </Button>
      </div>
    </Container>
  );
}
