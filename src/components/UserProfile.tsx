'use client';

import { useEffect, useState } from 'react';
import { ResumeData } from '@/lib/types';
import { User, Mail, Phone, Briefcase, GraduationCap, Code, FileText, Calendar, MapPin, Award, Loader2 } from 'lucide-react';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
        <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <p className="text-neutral-500">No resume uploaded yet</p>
      </div>
    );
  }

  const { analysis } = resume;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-black to-neutral-800 dark:from-white dark:to-neutral-200 rounded-2xl p-8 text-white dark:text-black">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center text-2xl font-medium">
              {analysis.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-light mb-1">{analysis.name}</h2>
              <p className="text-white/70 dark:text-black/70 text-sm">{analysis.proficiencyLevel} Level</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light mb-1">{analysis.yearsOfExperience}</p>
            <p className="text-white/70 dark:text-black/70 text-sm">Years Exp.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-white/60 dark:text-black/60" />
              <span className="text-sm">{analysis.email}</span>
            </div>
          )}
          {analysis.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-white/60 dark:text-black/60" />
              <span className="text-sm">{analysis.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {analysis.summary && (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-medium text-black dark:text-white">Professional Summary</h3>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-lg font-medium text-black dark:text-white">Technical Skills</h3>
          <span className="ml-auto text-sm text-neutral-500">{analysis.skills.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      {analysis.experience && analysis.experience.length > 0 && (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-medium text-black dark:text-white">Work Experience</h3>
            <span className="ml-auto text-sm text-neutral-500">{analysis.experience.length} positions</span>
          </div>
          <div className="space-y-6">
            {analysis.experience.map((exp, index) => (
              <div key={index} className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black dark:bg-white rounded-full" />
                <div className="mb-2">
                  <h4 className="text-base font-medium text-black dark:text-white">{exp.title}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {analysis.education && analysis.education.length > 0 && (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-medium text-black dark:text-white">Education</h3>
          </div>
          <div className="space-y-4">
            {analysis.education.map((edu, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-black dark:text-white">{edu.degree}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{edu.school}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-500">{edu.year}</span>
                    {edu.gpa && <span className="text-xs text-neutral-500">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {analysis.projects && analysis.projects.length > 0 && (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-medium text-black dark:text-white">Projects</h3>
            <span className="ml-auto text-sm text-neutral-500">{analysis.projects.length} projects</span>
          </div>
          <div className="space-y-4">
            {analysis.projects.map((project, index) => (
              <div key={index} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <h4 className="text-base font-medium text-black dark:text-white mb-2">{project.name}</h4>
                {project.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
