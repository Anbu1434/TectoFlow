import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4 relative overflow-hidden">
      {/* Background pattern matching Hero */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/10 to-amber-500/5 blur-[120px]" />

      <div className="text-center space-y-6 max-w-md relative z-10">
        <h1 className="text-8xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
          500
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Server-side error occurred
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Something went wrong on our servers. We are looking into it. Please try again later or return home.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
