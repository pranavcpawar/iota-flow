'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { InteractiveParticles } from '@/components/interactive-particles';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            // Add animate-in class to trigger animation
            element.classList.add('animate-in');
            // Force opacity to 1 to ensure visibility
            element.style.opacity = '1';
            // Unobserve after animation starts to improve performance
            observer.unobserve(element);
          }
        });
      },
      { 
        threshold: 0.01, // Lower threshold for better detection
        rootMargin: '150px' // Start animation earlier
      }
    );

    // Function to observe elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in-up');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        // Check if already in view
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight + 150 && rect.bottom > -150;
        
        if (isInView && !element.classList.contains('animate-in')) {
          // Already visible, animate immediately
          element.classList.add('animate-in');
          element.style.opacity = '1';
        } else {
          // Observe for scroll
          observer.observe(element);
        }
      });
    };

    // Initial check after DOM is ready
    setTimeout(observeElements, 50);
    
    // Also check on scroll for elements that might have been missed
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-up:not(.animate-in)');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight + 150 && rect.bottom > -150;
        
        if (isInView) {
          element.classList.add('animate-in');
          element.style.opacity = '1';
          observer.unobserve(element);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const workflow = [
    {
      step: 1,
      title: 'Create Order',
      description: 'Merchant generates sales order with QR code',
      icon: '→',
    },
    {
      step: 2,
      title: 'Customer Scan',
      description: 'Verification begins instantly',
      icon: '→',
    },
    {
      step: 3,
      title: 'Approve',
      description: 'Customer confirms the order',
      icon: '→',
    },
    {
      step: 4,
      title: 'Mint R-NFT',
      description: 'Receivable tokenized on-chain',
      icon: '→',
    },
    {
      step: 5,
      title: 'Pool Deposit',
      description: 'Added to receivable pool',
      icon: '→',
    },
    {
      step: 6,
      title: 'Liquidity',
      description: '80% advance to merchant',
      icon: '✓',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Interactive Particles */}
      <InteractiveParticles />
      
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-24">
          <div className="max-w-4xl mx-auto">
            <div ref={heroRef} className="text-center space-y-8 hero-section">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/40 bg-muted/30 backdrop-blur-xl text-sm text-muted-foreground animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live on IOTA Testnet</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-medium tracking-tight leading-[1.1]">
                Receivables,
                <br />
                <span className="text-muted-foreground">reimagined.</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform receivables into liquid assets. Instant liquidity for merchants, transparent
                returns for investors.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link
                  href="/merchant"
                  className="group relative px-6 py-3 rounded-lg bg-foreground text-background font-medium overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Start as Merchant</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 opacity-0 group-hover:opacity-10 transition-opacity" />
                </Link>
                <Link
                  href="/pools"
                  className="px-6 py-3 rounded-lg border border-border/40 hover:border-border hover:bg-muted/30 backdrop-blur-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Browse Pools
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up animation-delay-300">
              {[
                { value: '0', label: 'Active Orders', color: 'from-blue-500/20 to-blue-500/5' },
                { value: '0', label: 'R-NFTs Minted', color: 'from-purple-500/20 to-purple-500/5' },
                { value: '$0', label: 'Pool Value', color: 'from-emerald-500/20 to-emerald-500/5' },
                { value: '8-16%', label: 'APY Range', color: 'from-orange-500/20 to-orange-500/5' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`group relative p-6 rounded-xl border border-border/40 bg-gradient-to-br ${stat.color} backdrop-blur-xl hover:border-border transition-all hover:scale-[1.02]`}
                >
                  <div className="text-3xl font-semibold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-4xl font-medium mb-4">How it works</h2>
              <p className="text-muted-foreground">Six steps to liquid receivables</p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden md:block" />

              <div className="grid md:grid-cols-3 gap-8">
                {workflow.map((item, i) => (
                  <div
                    key={i}
                    className="fade-in-up group relative"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.02]">
                      {/* Step Number */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-sm font-medium">
                          {item.step}
                        </div>
                        <div className="text-2xl text-muted-foreground/40">{item.icon}</div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-chart-1/0 group-hover:from-primary/5 group-hover:to-chart-1/5 transition-all pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'For Merchants',
                  description: '80% advance on receivables. Instant liquidity without debt.',
                  features: ['Immediate cash flow', 'No credit checks', 'On-chain transparency'],
                },
                {
                  title: 'For Investors',
                  description: 'Earn 8-16% APY on tokenized receivables with clear risk profiles.',
                  features: ['Senior & Junior tranches', 'Automated waterfall', 'Blockchain secured'],
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className="fade-in-up p-8 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <h3 className="text-2xl font-medium mb-3">{section.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{section.description}</p>
                  <ul className="space-y-2">
                    {section.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center fade-in-up">
            <div className="p-12 rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl">
              <h2 className="text-3xl font-medium mb-4">Ready to get started?</h2>
              <p className="text-muted-foreground mb-8">
                Join the future of receivables financing on IOTA.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/merchant"
                  className="px-6 py-3 rounded-lg bg-foreground text-background font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Launch App
                </Link>
                <a
                  href="https://docs.iota.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-border/40 hover:border-border hover:bg-muted/30 backdrop-blur-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
