'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Search, Filter, ExternalLink, Briefcase, MapPin, DollarSign, Clock, RefreshCw, Brain, GraduationCap, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import { JobMatch } from '@/lib/types';
import gsap from 'gsap';

export default function JobsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [generatingResume, setGeneratingResume] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchJobs();
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/discover?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (!user) return;
    
    setFiltering(true);
    try {
      // Fetch existing jobs from database without scraping
      const response = await fetch(`/api/jobs/discover?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setFiltering(false);
    }
  };

  const discoverNewJobs = async () => {
    if (!user) return;
    
    setDiscovering(true);
    try {
      // Use selected location filter for job discovery
      const searchLocation = locationFilter === 'all' ? 'Pakistan' : locationFilter;
      
      const response = await fetch('/api/jobs/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          location: searchLocation,
          limit: 20 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      } else {
        alert(data.error || 'Failed to discover jobs');
      }
    } catch (error) {
      console.error('Error discovering jobs:', error);
      alert('Failed to discover jobs');
    } finally {
      setDiscovering(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400';
    if (score >= 80) return 'bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400';
    return 'bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const toggleDescription = (jobId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const truncateDescription = (text: string, lines: number = 3) => {
    const words = text.split(' ');
    const avgWordsPerLine = 15; // Approximate words per line
    const maxWords = lines * avgWordsPerLine;
    
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const handleInterviewPrep = (job: JobMatch) => {
    // Navigate to interview prep with role and technologies (no company)
    const technologies = job.job.tags.join(', ');
    const queryParams = new URLSearchParams({
      role: job.job.title,
      technologies: technologies,
    });
    router.push(`/dashboard/interview-prep?${queryParams.toString()}`);
  };

  const handleGenerateResume = async (job: JobMatch) => {
    if (!user) return;
    
    setGeneratingResume(job.id);
    
    try {
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          jobTitle: job.job.title,
          jobDescription: job.job.description,
          jobRequirements: job.job.requirements || [],
          jobTags: job.job.tags || [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate resume');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${job.job.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error generating resume:', error);
      alert(error.message || 'Failed to generate resume');
    } finally {
      setGeneratingResume(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || job.job.type === filterType;
    
    const matchesLocation = locationFilter === 'all' || 
      job.job.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      (locationFilter === 'Remote' && (job.job.location.toLowerCase().includes('remote') || job.job.location.toLowerCase().includes('anywhere')));
    
    return matchesSearch && matchesFilter && matchesLocation;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

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
            Job Matches
          </h1>
          <p className="text-lg text-neutral-500">
            AI-curated opportunities based on your profile
          </p>
        </div>

        {/* Actions */}
        <div className="fade-item flex flex-col sm:flex-row gap-4">
          <div className="relative sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
            />
          </div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-12 px-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
          >
            <option value="all">All Locations</option>
            <option value="Pakistan">🇵🇰 Pakistan</option>
            <option value="United States">🇺🇸 United States</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
            <option value="Canada">🇨🇦 Canada</option>
            <option value="Australia">🇦🇺 Australia</option>
            <option value="Germany">🇩🇪 Germany</option>
            <option value="United Arab Emirates">🇦🇪 UAE</option>
            <option value="Singapore">🇸🇬 Singapore</option>
            <option value="Remote">🌍 Remote Only</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-12 px-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-base focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <Button
            onClick={applyFilters}
            disabled={filtering}
            variant="outline"
            className="h-12 px-6 gap-2 whitespace-nowrap"
          >
            {filtering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Filtering...
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Filter
              </>
            )}
          </Button>
          <Button
            onClick={discoverNewJobs}
            disabled={discovering}
            className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 gap-2 whitespace-nowrap"
          >
            {discovering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Discovering...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Discover New Jobs
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="fade-item grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-2xl font-light text-black dark:text-white">{jobs.length}</p>
            <p className="text-sm text-neutral-500">Total Matches</p>
          </div>
          <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-2xl font-light text-black dark:text-white">
              {jobs.filter(j => j.matchScore >= 90).length}
            </p>
            <p className="text-sm text-neutral-500">Excellent Matches</p>
          </div>
          <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-2xl font-light text-black dark:text-white">
              {jobs.filter(j => j.status === 'applied').length}
            </p>
            <p className="text-sm text-neutral-500">Applied</p>
          </div>
          <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-2xl font-light text-black dark:text-white">
              {jobs.filter(j => j.status === 'new').length}
            </p>
            <p className="text-sm text-neutral-500">New</p>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="fade-item text-center py-16">
            <Briefcase className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-black dark:text-white mb-2">
              {jobs.length === 0 ? 'No jobs yet' : 'No matching jobs'}
            </h3>
            <p className="text-neutral-500 mb-6">
              {jobs.length === 0 
                ? 'Click "Discover New Jobs" to find opportunities matching your profile'
                : 'Try adjusting your search or filters'}
            </p>
            {jobs.length === 0 && (
              <Button onClick={discoverNewJobs} disabled={discovering}>
                Discover Jobs
              </Button>
            )}
          </div>
        ) : (
          <div className="fade-item space-y-4">
            {filteredJobs.map((match) => (
              <div
                key={match.id}
                className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-medium text-black dark:text-white group-hover:underline">
                        {match.job.title}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-mono ${getMatchColor(match.matchScore)}`}>
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {match.job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.job.location}
                      </span>
                      {match.job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {match.job.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(match.job.posted)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleGenerateResume(match)}
                      disabled={generatingResume === match.id}
                    >
                      {generatingResume === match.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Generate Resume
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleInterviewPrep(match)}
                    >
                      <GraduationCap className="w-4 h-4" />
                      Interview Prep
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(match.job.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Job
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {expandedDescriptions.has(match.id) 
                      ? match.job.description 
                      : truncateDescription(match.job.description, 3)}
                  </p>
                  {match.job.description.split(' ').length > 45 && (
                    <button
                      onClick={() => toggleDescription(match.id)}
                      className="mt-2 text-sm text-black dark:text-white hover:underline flex items-center gap-1"
                    >
                      {expandedDescriptions.has(match.id) ? (
                        <>
                          See less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          See more <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Why this matches</p>
                  <ul className="space-y-1">
                    {match.matchReasons.slice(0, 3).map((reason, i) => (
                      <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
