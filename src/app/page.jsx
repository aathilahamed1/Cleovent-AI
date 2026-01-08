
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline text-lg font-bold">CleoVent</span>
            <p className="text-[10px] text-muted-foreground">by Cstark</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://storage.googleapis.com/aai-sit-splash-assets/ecotwin/city-map-3d-heatmap.png"
            alt="3D city map with heatmap"
            fill
            className="object-cover"
            data-ai-hint="3d city map"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Visualize and Optimize Urban CO₂ Capture
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
              CleoVent is a digital twin platform that empowers city planners to
              deploy and simulate carbon capture interventions for a greener
              future.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">Start Simulating</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
