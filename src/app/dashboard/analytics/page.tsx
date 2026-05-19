'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, TrendingUp, Briefcase, FileText, Target, Brain, Activity, AlertCircle, CheckCircle, Info, BarChart3, Award } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import CircularProgress from '@/components/analytics/CircularProgress';
import SkillRadar from '@/components/analytics/SkillRadar';
import BarChart from '@/components/analytics/BarChart';
import LineChart from '@/components/analytics/LineChart';
import { UserAnalytics } from '@/lib/types';
import gsap from 'gsap';

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityTime = (timestamp: Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!user || !analytics) return null;

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
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="text-sm font-medium text-black dark:text-white">CareerAI</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8">
        {/* Title */}
        <div className="fade-item">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
            Career Analytics
          </h1>
          <p className="text-lg text-neutral-500">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Overview Stats with Circular Progress */}
        <div className="fade-item grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center">
            <CircularProgress
              value={analytics.totalJobsMatched}
              max={50}
              color="rgb(59, 130, 246)"
              showPercentage={false}
            />
            <p className="text-sm text-neutral-500 mt-2">Jobs Matched</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center">
            <CircularProgress
              value={analytics.totalApplications}
              max={20}
              color="rgb(168, 85, 247)"
              showPercentage={false}
            />
            <p className="text-sm text-neutral-500 mt-2">Applications</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center">
            <CircularProgress
              value={analytics.totalInterviews}
              max={10}
              color="rgb(34, 197, 94)"
              showPercentage={false}
            />
            <p className="text-sm text-neutral-500 mt-2">Interview Preps</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center">
            <CircularProgress
              value={analytics.skillCoverage.length}
              max={20}
              color="rgb(249, 115, 22)"
              showPercentage={false}
            />
            <p className="text-sm text-neutral-500 mt-2">Skills Tracked</p>
          </div>
        </div>

        {/* AI Insights */}
        {analytics.insights && analytics.insights.length > 0 && (
          <div className="fade-item space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-black dark:text-white" />
              <h2 className="text-xl font-medium text-black dark:text-white">AI-Generated Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.insights.map((insight: any, index: number) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border ${
                    insight.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                      : insight.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900'
                      : 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'info' && <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <h3 className={`font-medium mb-1 ${
                        insight.type === 'success' 
                          ? 'text-green-900 dark:text-green-100'
                          : insight.type === 'warning'
                          ? 'text-yellow-900 dark:text-yellow-100'
                          : 'text-brand-900 dark:text-brand-100'
                      }`}>
                        {insight.title}
                      </h3>
                      <p className={`text-sm ${
                        insight.type === 'success' 
                          ? 'text-green-700 dark:text-green-300'
                          : insight.type === 'warning'
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : 'text-brand-700 dark:text-brand-300'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Progress - Line Chart */}
        {analytics.weeklyProgress && analytics.weeklyProgress.length > 0 && (
          <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-black dark:text-white" />
              <div>
                <h2 className="text-xl font-medium text-black dark:text-white">Job Search Progress</h2>
                <p className="text-sm text-neutral-500">Your activity over the past 4 weeks</p>
              </div>
            </div>
            <div className="p-6">
              <LineChart
                data={analytics.weeklyProgress.map((week: any) => ({
                  label: week.week,
                  value: week.jobsViewed,
                }))}
                height={200}
                color="rgb(59, 130, 246)"
              />
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {analytics.weeklyProgress.reduce((sum: number, week: any) => sum + week.jobsViewed, 0)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Total Jobs Viewed</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {analytics.weeklyProgress.reduce((sum: number, week: any) => sum + week.applicationsSubmitted, 0)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Applications Sent</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analytics.weeklyProgress.reduce((sum: number, week: any) => sum + week.interviewsScheduled, 0)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Interview Preps</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skill Coverage */}
        {analytics.skillCoverage && analytics.skillCoverage.length > 0 && (
          <div className="fade-item grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Radar Chart */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-medium text-black dark:text-white">Top Skills Radar</h2>
                <p className="text-sm text-neutral-500">Visual representation of your top 6 skills</p>
              </div>
              <div className="p-6 flex items-center justify-center">
                <SkillRadar skills={analytics.skillCoverage} />
              </div>
            </div>

            {/* Skill Bar Chart */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                <Award className="w-5 h-5 text-black dark:text-white" />
                <div>
                  <h2 className="text-xl font-medium text-black dark:text-white">Skill Proficiency</h2>
                  <p className="text-sm text-neutral-500">Your skill levels and job demand</p>
                </div>
              </div>
              <div className="p-6">
                <BarChart
                  data={analytics.skillCoverage.slice(0, 8).map((skill: any) => {
                    const proficiency = Math.round(skill.current);
                    const isStrength = proficiency >= 85;
                    const needsWork = proficiency < 70;
                    
                    return {
                      label: skill.skill,
                      value: proficiency,
                      color: isStrength 
                        ? 'rgb(34, 197, 94)' 
                        : needsWork 
                        ? 'rgb(234, 179, 8)' 
                        : 'rgb(0, 0, 0)',
                    };
                  })}
                  maxValue={100}
                />
              </div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        {analytics.activityLog && analytics.activityLog.length > 0 && (
          <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <Activity className="w-5 h-5 text-black dark:text-white" />
              <div>
                <h2 className="text-xl font-medium text-black dark:text-white">Recent Activity</h2>
                <p className="text-sm text-neutral-500">Your latest actions and milestones</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                {analytics.activityLog.slice(0, 15).map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <div className="w-2 h-2 mt-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black dark:text-white">
                        {activity.action} <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!analytics.activityLog || analytics.activityLog.length === 0) && (!analytics.skillCoverage || analytics.skillCoverage.length === 0) && (
          <div className="fade-item text-center py-16">
            <Activity className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-black dark:text-white mb-2">
              No analytics yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Start by uploading your resume and discovering jobs to see your analytics
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => router.push('/dashboard/upload-resume')}>
                Upload Resume
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/jobs')}>
                Discover Jobs
              </Button>
            </div>
          </div>
        )}
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
