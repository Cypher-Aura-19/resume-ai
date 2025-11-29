'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, LayoutGrid, Loader2, Bell, Search, Plus, FileText, Briefcase, Target, TrendingUp, Brain, Upload, ChevronRight, User } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import UserProfile from '@/components/UserProfile';
import ProfileSummaryCard from '@/components/ProfileSummaryCard';
import gsap from 'gsap';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    jobsMatched: 0,
    applications: 0,
    interviews: 0,
    skillScore: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;
    
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/dashboard/stats?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.set('.dash-item', { y: 30, opacity: 0 });
        gsap.set('.card-item', { y: 20, opacity: 0, scale: 0.98 });
        
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.to('.dash-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 })
          .to('.card-item', { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 }, '-=0.4');
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const statsDisplay = [
    { label: 'Jobs Matched', value: stats.jobsMatched.toString(), change: '+0', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Applications', value: stats.applications.toString(), change: '+0', icon: FileText, color: 'bg-purple-500' },
    { label: 'Interviews', value: stats.interviews.toString(), change: '+0', icon: Target, color: 'bg-green-500' },
    { label: 'Skill Score', value: `${stats.skillScore}%`, change: '+0%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      <GridPattern />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 p-6 hidden lg:flex flex-col z-40">
        <div className="dash-item flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-medium text-black dark:text-white">CareerAI</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { icon: LayoutGrid, label: 'Overview', href: '/dashboard' },
            { icon: FileText, label: 'Resume', href: '/dashboard/upload-resume' },
            { icon: Briefcase, label: 'Job Matches', href: '/dashboard/jobs' },
            { icon: Target, label: 'Interview Prep', href: '/dashboard/interview-prep' },
            { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
            { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
          ].map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="dash-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="dash-item p-4 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white dark:text-black" />
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full h-10 pl-11 pr-4 bg-neutral-100 dark:bg-neutral-900 border-0 rounded-full text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex h-9 rounded-full gap-2"
                onClick={() => router.push('/dashboard/upload-resume')}
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
              <button className="relative p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-8">
          {/* Welcome */}
          <div className="dash-item">
            <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase mb-2">Dashboard</p>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-black dark:text-white">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-neutral-500 mt-2">Here&apos;s your job search progress</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsDisplay.map((stat) => (
              <div key={stat.label} className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-500 font-mono bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-light text-black dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions & Profile Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Profile Summary Card */}
            <div className="card-item md:col-span-2">
              <ProfileSummaryCard userId={user.id} />
            </div>

            {/* Quick Action Cards */}
            <button 
              onClick={() => router.push('/dashboard/jobs')}
              className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift text-left group"
            >
              <Search className="w-8 h-8 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
              <h3 className="text-base font-medium text-black dark:text-white mb-1">Discover Jobs</h3>
              <p className="text-sm text-neutral-500">Browse AI-matched opportunities</p>
              <ChevronRight className="w-5 h-5 text-neutral-400 mt-2" />
            </button>
            <button 
              onClick={() => router.push('/dashboard/interview-prep')}
              className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift text-left group"
            >
              <Target className="w-8 h-8 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
              <h3 className="text-base font-medium text-black dark:text-white mb-1">Prep Interview</h3>
              <p className="text-sm text-neutral-500">Get personalized practice questions</p>
              <ChevronRight className="w-5 h-5 text-neutral-400 mt-2" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile */}
            <div className="lg:col-span-2 card-item">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-2xl font-light text-black dark:text-white">Your Profile</h2>
                </div>
                <p className="text-sm text-neutral-500">Based on your uploaded resume</p>
              </div>
              <UserProfile userId={user.id} />
            </div>

            {/* Getting Started Sidebar */}
            <div className="card-item space-y-6">
              <div className="bg-gradient-to-br from-black to-neutral-800 dark:from-white dark:to-neutral-200 rounded-2xl p-6 text-white dark:text-black">
                <h3 className="text-lg font-medium mb-4">Quick Guide</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Upload Resume</p>
                      <p className="text-xs text-white/70 dark:text-black/70">AI analyzes your skills</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Discover Jobs</p>
                      <p className="text-xs text-white/70 dark:text-black/70">Get matched opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Prep Interviews</p>
                      <p className="text-xs text-white/70 dark:text-black/70">Practice with AI questions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-base font-medium text-black dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Resume analyzed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Jobs discovered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Profile updated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
