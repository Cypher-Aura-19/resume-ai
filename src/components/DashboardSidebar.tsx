'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Briefcase, Target, TrendingUp, Settings, Brain, User } from 'lucide-react';

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutGrid, label: 'Overview', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: FileText, label: 'Resume', href: '/dashboard/upload-resume' },
    { icon: Briefcase, label: 'Job Matches', href: '/dashboard/jobs' },
    { icon: Target, label: 'Interview Prep', href: '/dashboard/interview-prep' },
    { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 p-6 hidden lg:flex flex-col z-40">
      <div className="dash-item flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-white dark:text-black" />
        </div>
        <span className="text-lg font-medium text-black dark:text-white">Navigation</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`dash-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${isActive
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
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
  );
}
