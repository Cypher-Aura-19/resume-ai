'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Search, FileText, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: '01',
        title: 'Create Profile',
        description: 'Upload your resume. Our AI instantly parses your skills, experience, and education to build a comprehensive professional profile.',
        icon: Upload,
        color: 'bg-brand-500',
        lightColor: 'bg-brand-500/10',
        textColor: 'text-brand-500'
    },
    {
        id: '02',
        title: 'Smart Discovery',
        description: 'We scan thousands of job boards. Our algorithm matches you with roles that fit your specific skill set and career aspirations.',
        icon: Search,
        color: 'bg-brand-500',
        lightColor: 'bg-brand-500/10',
        textColor: 'text-brand-500'
    },
    {
        id: '03',
        title: 'AI Preparation',
        description: 'Get tailored interview questions and study guides. Practice with AI to build confidence for your specific target roles.',
        icon: FileText,
        color: 'bg-orange-500',
        lightColor: 'bg-orange-500/10',
        textColor: 'text-orange-500'
    },
    {
        id: '04',
        title: 'Get Hired',
        description: 'Track your applications and land your dream job. We provide the insights you need to negotiate and succeed.',
        icon: CheckCircle2,
        color: 'bg-green-500',
        lightColor: 'bg-green-500/10',
        textColor: 'text-green-500'
    },
];

export default function HowItWorksSection() {
    const containerRef = useRef<HTMLElement>(null);



    return (
        <section ref={containerRef} className="py-32 px-6 lg:px-8 bg-white dark:bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
                        <Sparkles className="w-3 h-3" />
                        <span>Simple Process</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">
                        Your journey to success
                    </h2>
                    <p className="text-lg text-neutral-500">
                        We&apos;ve streamlined the job search process into four powerful steps designed to get you hired faster.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="step-card group relative p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${step.color}`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl ${step.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                        <step.icon className={`w-7 h-7 ${step.textColor}`} />
                                    </div>
                                    <span className="text-4xl font-bold text-neutral-100 dark:text-neutral-800 group-hover:text-neutral-200 dark:group-hover:text-neutral-700 transition-colors">
                                        {step.id}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-black dark:text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
                                    {step.title}
                                </h3>

                                <p className="text-neutral-500 leading-relaxed mb-8 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                                    {step.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-black dark:text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
