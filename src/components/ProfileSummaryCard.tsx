'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeData } from '@/lib/types';
import { User, Code, Briefcase, GraduationCap, ChevronRight, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileSummaryCardProps {
  userId: string;
}

export default function ProfileSummaryCard({ userId }: ProfileSummaryCardProps) {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchResume();
  }, [userId]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resume/upload?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setResume(data.data);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
        <Upload className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-2">No Resume Yet</h3>
        <p className="text-sm text-neutral-500 mb-4">Upload your resume to get started</p>
        <Button onClick={() => router.push('/dashboard/upload-resume')} className="rounded-full">
          Upload Resume
        </Button>
      </div>
    );
  }

  const { analysis } = resume;

  return (
    <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover-lift">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-neutral-800 dark:from-white dark:to-neutral-200 p-6 text-white dark:text-black">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center text-lg font-medium">
            {analysis.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-medium">{analysis.name}</h3>
            <p className="text-sm text-white/70 dark:text-black/70">{analysis.proficiencyLevel} Level</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-light">{analysis.yearsOfExperience}</p>
            <p className="text-xs text-white/70 dark:text-black/70">Years Experience</p>
          </div>
          <div>
            <p className="text-2xl font-light">{analysis.skills.length}</p>
            <p className="text-xs text-white/70 dark:text-black/70">Skills</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Code className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-600 dark:text-neutral-400">
            {analysis.skills.slice(0, 3).join(', ')}
            {analysis.skills.length > 3 && ` +${analysis.skills.length - 3} more`}
          </span>
        </div>
        
        {analysis.experience && analysis.experience.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400">
              {analysis.experience.length} work {analysis.experience.length === 1 ? 'experience' : 'experiences'}
            </span>
          </div>
        )}
        
        {analysis.education && analysis.education.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400">
              {analysis.education[0].degree}
            </span>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard/profile')}
          className="w-full mt-4 flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
        >
          <span className="text-sm font-medium text-black dark:text-white">View Full Profile</span>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
