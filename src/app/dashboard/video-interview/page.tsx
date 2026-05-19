'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import CameraView from '@/components/video-interview/CameraView';
import QuestionFlow from '@/components/video-interview/QuestionFlow';
import Results from '@/components/video-interview/Results';
import { useVoiceInterviewFlow } from '@/hooks/useVoiceInterviewFlow';

function VideoInterviewContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'technical';
  const prepId = searchParams.get('prepId');
  
  const [cameraReady, setCameraReady] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const {
    questions,
    currentQuestionIndex,
    responses,
    isLoading,
    isListening,
    currentTranscript,
    interviewCompleted,
    startInterview,
    stopInterview,
  } = useVoiceInterviewFlow(category, prepId || undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Initialize camera
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        setStream(mediaStream);
        setCameraReady(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Camera access is required for video interview mode.');
      }
    };

    if (user) {
      initCamera();
    }

    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user]);

  const handleStartInterview = () => {
    if (questions.length > 0) {
      startInterview();
    }
  };

  const handleExit = () => {
    stopInterview();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    router.push('/dashboard/interview-prep');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (interviewCompleted) {
    return (
      <Results
        responses={responses}
        onExit={handleExit}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CameraView stream={stream} cameraReady={cameraReady} />
      
      <QuestionFlow
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        isListening={isListening}
        currentTranscript={currentTranscript}
        onStart={handleStartInterview}
        onExit={handleExit}
        started={currentQuestionIndex >= 0}
      />
    </div>
  );
}

export default function VideoInterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <VideoInterviewContent />
    </Suspense>
  );
}
