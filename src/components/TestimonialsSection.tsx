'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Software Engineer, TechCorp',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        quote: 'The AI analysis was spot on. It identified skills I didn\'t even know I had and matched me with my dream job in weeks.',
        rating: 5
    },
    {
        id: 2,
        name: 'Michael Ross',
        role: 'Product Manager, Innovate Inc',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        quote: 'This platform completely transformed my job search. The interview prep guides were incredibly detailed and specific to the roles I applied for.',
        rating: 5
    },
    {
        id: 3,
        name: 'Emily Watson',
        role: 'UX Designer, Creative Studio',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        quote: 'I was struggling to get past the initial screening. After using the resume optimizer, I started getting callbacks almost immediately.',
        rating: 5
    }
];

export default function TestimonialsSection() {
    const [activeId, setActiveId] = useState(testimonials[1].id); // Start with middle one active

    const activeTestimonial = testimonials.find(t => t.id === activeId) || testimonials[0];

    return (
        <section className="py-24 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-sm font-mono tracking-widest text-brand-500 uppercase mb-4 flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-brand-500"></span>
                        WHAT CLIENTS SAY
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-serif text-black dark:text-white mb-6">
                        Honest Feedback<br />From Valued People
                    </h2>
                    <p className="text-neutral-500 max-w-xl mx-auto">
                        Real feedback from students and professionals who trusted our platform to elevate their careers.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Image Selector */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-6">
                        {testimonials.map((t) => (
                            <motion.button
                                key={t.id}
                                onClick={() => setActiveId(t.id)}
                                className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${activeId === t.id
                                    ? 'w-32 h-32 ring-4 ring-brand-500 ring-offset-4 ring-offset-neutral-50 dark:ring-offset-neutral-900 grayscale-0'
                                    : 'w-24 h-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                                    }`}
                                layout
                            >
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>

                    {/* Right Column: Content Card */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode='popLayout'>
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="bg-white dark:bg-black rounded-[2rem] p-8 lg:p-12 shadow-xl relative"
                            >
                                {/* Background Quote Icon */}
                                <div className="absolute top-8 right-8 text-neutral-100 dark:text-neutral-800 pointer-events-none">
                                    <Quote size={120} fill="currentColor" />
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl lg:text-4xl font-light leading-tight text-black dark:text-white mb-8">
                                        &ldquo;{activeTestimonial.quote}&rdquo;
                                    </h3>

                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-neutral-100 dark:border-neutral-800 pt-8">
                                        <div>
                                            <p className="text-lg font-bold text-black dark:text-white mb-1">
                                                {activeTestimonial.name}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {activeTestimonial.role}
                                            </p>
                                        </div>

                                        <div className="flex gap-1">
                                            {[...Array(activeTestimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-brand-500 text-brand-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
