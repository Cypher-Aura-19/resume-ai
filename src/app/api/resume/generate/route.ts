import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStoreSupabase';
import { generateTailoredResume } from '@/lib/gemini';
import { generateResumePDF } from '@/lib/resumePDF';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobTitle, jobDescription, jobRequirements, jobTags } = body;

    if (!userId || !jobTitle) {
      return NextResponse.json(
        { error: 'User ID and job title are required' },
        { status: 400 }
      );
    }

    console.log(`Generating tailored resume for ${jobTitle}`);

    // Get user's resume
    const resume = await dataStore.getResume(userId);

    if (!resume) {
      return NextResponse.json(
        { error: 'Please upload your resume first' },
        { status: 400 }
      );
    }

    // Generate tailored resume content using AI
    const tailoredResume = await generateTailoredResume(
      resume.analysis,
      jobTitle,
      jobDescription || '',
      jobRequirements || [],
      jobTags || []
    );

    // Generate PDF
    const pdfBuffer = await generateResumePDF(tailoredResume);

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Resume_${jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
