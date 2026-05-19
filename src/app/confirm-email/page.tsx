'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { GridPattern, FloatingShapes } from '@/components/Doodles';
import gsap from 'gsap';

import { Suspense } from 'react';

function ConfirmEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.fade-item', { y: 30, opacity: 0 });
      gsap.to('.fade-item', {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power4.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    setResendMessage('');

    try {
      const res = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendMessage('Confirmation email sent! Please check your inbox.');
      } else {
        setResendMessage(data.error || 'Failed to resend email');
      }
    } catch {
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-white dark:bg-black relative overflow-hidden px-4">
      <GridPattern />
      <FloatingShapes />

      <div className="w-full max-w-md relative z-10">
        <div className="fade-item text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-100 dark:bg-brand-950 rounded-full mb-6">
            <Mail className="w-10 h-10 text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-black dark:text-white mb-3">
            Check your email
          </h1>
          <p className="text-neutral-500">
            We&apos;ve sent a confirmation link to
          </p>
          {email && (
            <p className="text-black dark:text-white font-medium mt-1">
              {email}
            </p>
          )}
        </div>

        <div className="fade-item bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-black dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Next steps
          </h3>
          <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-medium">1</span>
              <span>Open your email inbox</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-medium">2</span>
              <span>Find the email from Navigation (check spam if needed)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-medium">3</span>
              <span>Click the confirmation link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-medium">4</span>
              <span>Return here and log in</span>
            </li>
          </ol>
        </div>

        <div className="fade-item space-y-3">
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            Go to Login
          </Button>

          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={resending || !email}
            className="w-full h-12"
          >
            {resending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Resend confirmation email
          </Button>

          {resendMessage && (
            <p className={`text-sm text-center ${resendMessage.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>
              {resendMessage}
            </p>
          )}

          <Button
            variant="ghost"
            onClick={() => router.push('/signup')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Button>
        </div>

        <p className="fade-item text-center text-xs text-neutral-400 mt-6">
          Didn&apos;t receive the email? Check your spam folder or try a different email address.
        </p>
      </div>

      <div className="noise-overlay" />
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    }>
      <ConfirmEmailPageContent />
    </Suspense>
  );
}
