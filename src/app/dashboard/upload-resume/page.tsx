'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, X, Brain, Sparkles } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import gsap from 'gsap';

export default function UploadResumePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Fetch existing resume on mount
  useEffect(() => {
    const fetchExistingResume = async () => {
      if (!user) return;
      
      setLoadingExisting(true);
      try {
        const response = await fetch(`/api/resume/upload?userId=${user.id}`);
        const data = await response.json();
        
        if (response.ok && data.data) {
          setAnalysis(data.data.analysis);
          console.log('Loaded existing resume analysis:', data.data);
        }
      } catch (error) {
        console.error('Error fetching existing resume:', error);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExistingResume();
  }, [user]);

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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      // Show analysis immediately - jobs are being processed in background
      setUploading(false);
      setAnalyzing(false);
      setAnalysis(data.data.analysis);
      
      // Show success message that jobs are being discovered
      console.log('Resume analyzed! Jobs are being discovered in the background...');
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      alert(error.message || 'Failed to upload resume');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  if (isLoading || loadingExisting) {
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
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-8">
        {/* Title */}
        <div className="fade-item text-center">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Let AI analyze your resume to extract skills, experience, and build your comprehensive profile
          </p>
        </div>

        {!analysis ? (
          <>
            {/* Upload Area */}
            <div className="fade-item">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900'
                    : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black'
                }`}
              >
                {!file ? (
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-full">
                      <Upload className="w-10 h-10 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-black dark:text-white mb-2">
                        Drop your resume here
                      </p>
                      <p className="text-sm text-neutral-500 mb-4">
                        or click to browse files
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button asChild className="cursor-pointer">
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Supports PDF format only • Max 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full">
                      <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-black dark:text-white mb-2">
                        {file.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={handleUpload}
                        disabled={uploading || analyzing}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : analyzing ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                            Analyzing...
                          </>
                        ) : (
                          'Analyze Resume'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setFile(null)}
                        disabled={uploading || analyzing}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="fade-item grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: 'AI Analysis', desc: 'Advanced NLP extracts key information' },
                { icon: Sparkles, title: 'Smart Parsing', desc: 'Identifies skills and experience levels' },
                { icon: CheckCircle, title: 'Instant Results', desc: 'Get your profile in seconds' },
              ].map((feature) => (
                <div key={feature.title} className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl mb-4">
                    <feature.icon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="text-base font-medium text-black dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Analysis Results */
          <div className="fade-item space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-2xl flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100">Analysis Complete!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Your profile has been updated with the extracted information</p>
              </div>
            </div>

            <div className="p-6 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-2xl flex items-center gap-4">
              <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
              <div>
                <h3 className="text-lg font-medium text-brand-900 dark:text-brand-100">Discovering Jobs...</h3>
                <p className="text-sm text-brand-700 dark:text-brand-300">We're finding matching opportunities for you in the background. Check the Jobs page in a moment!</p>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-medium text-black dark:text-white">Profile Summary</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Proficiency Level</p>
                    <p className="text-lg font-medium text-black dark:text-white">{analysis.proficiencyLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Years of Experience</p>
                    <p className="text-lg font-medium text-black dark:text-white">{analysis.yearsOfExperience} years</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Skills Identified</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Experience</p>
                  <div className="space-y-3">
                    {analysis.experience.map((exp: any, i: number) => (
                      <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <p className="font-medium text-black dark:text-white">{exp.title}</p>
                        <p className="text-sm text-neutral-500">{exp.company} • {exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Projects</p>
                  <div className="space-y-3">
                    {analysis.projects.map((project: any, i: number) => (
                      <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <p className="font-medium text-black dark:text-white mb-2">{project.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech: string) => (
                            <span key={tech} className="text-xs px-2 py-1 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                }}
              >
                Upload Another
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
