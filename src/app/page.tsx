'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Sparkles, FileText, Search, Brain, TrendingUp, Target, Zap, Check } from 'lucide-react';
import { GridPattern, MarqueeText } from '@/components/Doodles';
import ServicesSection from '@/components/ServicesSection';
import Hero3D from '@/components/Hero3D';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/HowItWorksSection';
import Preloader from '@/components/Preloader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Suspense } from 'react';

function HomePageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-word', { y: 100, opacity: 0, rotateX: -40 });
      gsap.set('.fade-up', { y: 40, opacity: 0 });
      gsap.set('.scale-in', { scale: 0.8, opacity: 0 });


      const tl = gsap.timeline({ defaults: { ease: 'power4.out', force3D: true } });
      tl.to('.hero-word', { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15 })

        .to('.fade-up', { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.8')
        .to('.scale-in', { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.5');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  const stats = [
    { value: '50K+', label: 'Jobs Discovered' },
    { value: '95%', label: 'Match Accuracy' },
    { value: '10K+', label: 'Students Helped' },
    { value: '500+', label: 'Companies' },
  ];

  const features = [
    { icon: FileText, title: 'Smart Resume Analysis', desc: 'Upload your resume and let AI extract skills, experience, and build your comprehensive profile automatically.' },
    { icon: Search, title: 'Auto Job Discovery', desc: 'AI scrapes and filters thousands of jobs across the internet, ranking them by relevance to your unique profile.' },
    { icon: Brain, title: 'AI Interview Prep', desc: 'Get personalized, research-backed interview questions and study guides tailored to specific roles and technologies.' },
    { icon: TrendingUp, title: 'Career Analytics', desc: 'Track your job search progress, identify skill gaps, and get actionable insights to improve your chances.' },
  ];




  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black overflow-x-hidden relative">
      <Preloader onComplete={() => ScrollTrigger.refresh()} />
      <GridPattern />


      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="fade-up flex items-center gap-3">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="text-lg font-medium text-black dark:text-white">Navigation</span>
          </div>
          <div className="fade-up hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <a key={item} href="#" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white animated-underline transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="fade-up flex items-center gap-3">
            <a href="/login" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Sign in
            </a>
            <Button onClick={() => router.push('/signup')} className="h-9 px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 lg:px-8 pt-20 relative">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-4xl relative z-10">
            {/* Badge */}
            <div className="fade-up inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-full text-sm mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-neutral-600 dark:text-neutral-300 font-medium tracking-wide text-xs uppercase">AI-Powered Job Discovery</span>
            </div>

            {/* Hero Text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] mb-8" style={{ perspective: '1000px' }}>
              <span className="hero-word inline-block text-black dark:text-white">Land your</span><br />
              <span className="hero-word inline-block bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-300 dark:to-brand-500 pb-2">dream tech</span><br />
              <span className="hero-word inline-block text-black dark:text-white">job with</span>{' '}
              <span className="hero-word inline-block text-neutral-400 italic font-serif">AI.</span>
            </h1>

            <p className="fade-up text-xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed mb-10 font-light">
              Upload your resume, discover perfectly matched jobs, and ace interviews with AI-powered personalized prep. Your career journey, simplified.
            </p>

            {/* CTA Buttons */}
            <div className="fade-up flex flex-row items-center gap-6 mb-16">
              <Button
                onClick={() => router.push('/signup')}
                className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="h-14 px-8 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full text-base font-medium transition-all duration-300 hover:shadow-md"
              >
                View Demo
              </Button>
            </div>


            {/* Stats */}
            <div className="fade-up flex flex-wrap gap-8 lg:gap-12">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl lg:text-3xl font-light text-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                  </div>
                  {i < stats.length - 1 && <div className="hidden sm:block h-10 w-px bg-neutral-200 dark:bg-neutral-800" />}
                </div>
              ))}
            </div>
          </div>

          {/* 3D Visual */}
          <div className="hidden lg:block h-[600px] w-full fade-up overflow-visible">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 mt-20">
        <MarqueeText
          text="✦ Resume Analysis ✦ Job Discovery ✦ AI Interview Prep ✦ Career Analytics ✦ Skill Matching ✦ Personalized Questions"
          className="text-sm text-neutral-400 font-mono"
        />
      </div>

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Footer */}
      <Footer />

      <div className="noise-overlay" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        {/* Fallback matches preloader background to avoid flash */}
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
