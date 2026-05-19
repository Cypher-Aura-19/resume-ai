'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const services = [
  {
    id: '01',
    title: 'Resume Analysis',
    description: 'AI-powered extraction of skills and experience to build your comprehensive profile.',
    tags: ['PDF Parsing', 'Skill Extraction', 'Profile Building', 'ATS Optimization'],
    color: 'from-brand-400 to-brand-600',
    image: '/service 1.jpg'
  },
  {
    id: '02',
    title: 'Job Discovery',
    description: 'Automated scraping and ranking of relevant job opportunities across the web.',
    tags: ['Web Scraping', 'Relevance Ranking', 'Real-time Updates', 'Smart Filtering'],
    color: 'from-green-500 to-emerald-500',
    image: '/service 2.jpg'
  },
  {
    id: '03',
    title: 'Interview Prep',
    description: 'Personalized questions and study guides tailored to specific roles and tech stacks.',
    tags: ['Custom Questions', 'Role-play', 'Technical Guides', 'Behavioral Prep'],
    color: 'from-brand-500 to-brand-700',
    image: '/service 3.jpg'
  },
  {
    id: '04',
    title: 'Career Analytics',
    description: 'Track your application progress and identify skill gaps for improvement.',
    tags: ['Application Tracking', 'Skill Gap Analysis', 'Progress Insights', 'Success Metrics'],
    color: 'from-orange-500 to-red-500',
    image: '/service 4.jpg'
  }
];

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative border-t border-neutral-200 dark:border-neutral-800 py-12 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start gap-6">
                  <span className="text-sm font-mono text-neutral-400 pt-2">({service.id})</span>
                  <div>
                    <h3 className="text-5xl md:text-7xl font-light tracking-tight mb-4 group-hover:translate-x-4 transition-transform duration-500">
                      {service.title}
                    </h3>
                    <p className="text-lg text-neutral-500 mb-4 max-w-xl">{service.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                      {service.tags.map((tag, i) => (
                        <span key={tag} className="flex items-center">
                          {tag}
                          {i < service.tags.length - 1 && <span className="mx-2 text-neutral-300 dark:text-neutral-700">•</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="w-12 h-12 text-black dark:text-white" />
                </div>
              </div>

              {/* Hover Image Reveal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{
                  opacity: hoveredService === service.id ? 1 : 0,
                  scale: hoveredService === service.id ? 1 : 0.9,
                  rotate: hoveredService === service.id ? 0 : -2
                }}
                transition={{ duration: 0.25, ease: "circOut" }}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-60 rounded-2xl overflow-hidden pointer-events-none z-20 hidden lg:block shadow-2xl"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          ))}
          <div className="border-t border-neutral-200 dark:border-neutral-800" />
        </div>
      </div>
    </section>
  );
}
