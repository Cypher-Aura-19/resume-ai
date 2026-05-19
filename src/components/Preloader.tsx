'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.inOut' },
                onComplete: () => {
                    // Small delay to ensure animation frame is done before heavy React updates
                    setTimeout(() => {
                        setIsComplete(true);
                        document.body.style.overflow = '';
                        window.dispatchEvent(new CustomEvent('preloader:complete'));
                        if (onComplete) onComplete();
                    }, 100);
                },
            });

            // Counter Animation
            const counter = { value: 0 };

            tl.to(counter, {
                value: 100,
                duration: 1.5,
                ease: 'expo.out', // Fast start, smooth end
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.round(counter.value).toString();
                    }
                },
            })
                .to(counterRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                }, '-=0.2') // Start fading slightly before counter ends
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    force3D: true, // Hardware acceleration
                    onStart: () => {
                        // Hint browser to optimize
                        if (containerRef.current) {
                            containerRef.current.style.willChange = 'transform';
                        }
                    }
                }, '-=0.1'); // Overlap with fade out

        }, containerRef);

        return () => {
            ctx.revert();
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    if (isComplete) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900 text-white"
        >
            <div className="relative flex items-end overflow-hidden leading-none">
                <span
                    ref={counterRef}
                    className="text-[15vw] md:text-[12vw] font-bold tracking-tighter"
                >
                    0
                </span>
                <span className="text-2xl md:text-4xl font-light mb-4 md:mb-8 ml-2">%</span>
            </div>
        </div>
    );
}
