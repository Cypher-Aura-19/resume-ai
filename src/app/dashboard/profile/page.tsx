'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Edit, Brain } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import UserProfile from '@/components/UserProfile';
import gsap from 'gsap';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      <GridPattern />
      
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/upload-resume')}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Update Resume
              </Button>
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white dark:text-black" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-8">
          {/* Title */}
          <div className="fade-item">
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
              Your Profile
            </h1>
            <p className="text-lg text-neutral-500">
              Complete profile based on your resume analysis
            </p>
          </div>

          {/* Profile Content */}
          <div className="fade-item">
            <UserProfile userId={user.id} />
          </div>
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
