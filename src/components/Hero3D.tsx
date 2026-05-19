'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Group } from 'three';

gsap.registerPlugin(ScrollTrigger);

function Model() {
    const { scene } = useGLTF('/cute_robot/scene.gltf');
    const modelRef = useRef<Group>(null);

    useEffect(() => {
        if (!modelRef.current) return;

        const rotation = modelRef.current.rotation;

        const onPreloaderSpin = () => {
            gsap.killTweensOf(rotation);

            // Phase 1 (0.8s): fast burst — timed to match the preloader slide-up duration
            // so the model is at PEAK speed exactly when the screen finishes clearing
            // Phase 2 (2.2s): decelerate smoothly to a full stop
            const tl = gsap.timeline({
                onComplete: () => {
                    // After spin settles, set up scroll-driven rotation
                    const scrollTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: 'body',
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 1,
                        },
                    });
                    scrollTl.to(rotation, {
                        y: `+=${Math.PI * 12}`,
                        ease: 'none',
                    });
                },
            });

            tl.to(rotation, {
                y: `+=${Math.PI * 4}`,   // ramp up — 2 full rotations in 0.8s
                duration: 0.8,
                ease: 'power3.in',
            }).to(rotation, {
                y: `+=${Math.PI * 8}`,   // decelerate — 4 more rotations dying to stop
                duration: 2.2,
                ease: 'power4.out',
            });
        };

        window.addEventListener('preloader:spin', onPreloaderSpin);

        return () => {
            window.removeEventListener('preloader:spin', onPreloaderSpin);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={2.5}
            position={[0, -1, 0]}
        />
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                shadows
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                    <Float
                        speed={2}
                        rotationIntensity={0.5}
                        floatIntensity={0.5}
                    >
                        <Model />
                    </Float>

                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />

                    <OrbitControls
                        enablePan={true}
                        enableZoom={false}
                        enableRotate={true}
                        autoRotate={false}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Preload the model to avoid pop-in
useGLTF.preload('/cute_robot/scene.gltf');
