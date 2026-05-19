import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'technical';
    const prepId = searchParams.get('prepId');

    const supabase = await createClient();

    // If prepId is provided, fetch questions from prep material
    if (prepId) {
      const { data: prepData, error: prepError } = await supabase
        .from('interview_preps')
        .select('prep_material')
        .eq('id', prepId)
        .single();

      if (!prepError && prepData) {
        const prepMaterial = prepData.prep_material;
        const questions: { id: string; question: string; category: string }[] = [];

        // Extract technical questions
        if (category === 'technical' && prepMaterial.technicalQuestions) {
          prepMaterial.technicalQuestions.forEach((q: any, index: number) => {
            questions.push({
              id: `tech-${index}`,
              question: q.question,
              category: 'technical',
            });
          });
        }

        // Extract behavioral questions
        if (category === 'behavioral' && prepMaterial.behavioralQuestions) {
          prepMaterial.behavioralQuestions.forEach((q: any, index: number) => {
            questions.push({
              id: `behavioral-${index}`,
              question: q.question,
              category: 'behavioral',
            });
          });
        }

        if (questions.length > 0) {
          return NextResponse.json({
            success: true,
            questions: questions.slice(0, 5), // Limit to 5 questions
          });
        }
      }
    }

    // Fallback: Fetch questions from Supabase interview_questions table
    const { data, error } = await supabase
      .from('interview_questions')
      .select('id, question, category')
      .eq('category', category)
      .limit(5);

    if (error) {
      console.error('Error fetching questions:', error);
      const mockQuestions = getMockQuestions(category);
      return NextResponse.json({
        success: true,
        questions: mockQuestions,
      });
    }

    if (!data || data.length === 0) {
      const mockQuestions = getMockQuestions(category);
      return NextResponse.json({
        success: true,
        questions: mockQuestions,
      });
    }

    return NextResponse.json({
      success: true,
      questions: data,
    });
  } catch (error: any) {
    console.error('Error in questions API:', error);
    const category = new URL(request.url).searchParams.get('category') || 'technical';
    const mockQuestions = getMockQuestions(category);
    
    return NextResponse.json({
      success: true,
      questions: mockQuestions,
    });
  }
}

// Mock questions for testing (will be replaced by Supabase data)
function getMockQuestions(category: string) {
  const questions: Record<string, any[]> = {
    technical: [
      {
        id: '1',
        question: 'Can you explain the difference between var, let, and const in JavaScript?',
        category: 'technical',
      },
      {
        id: '2',
        question: 'What is the virtual DOM and how does React use it?',
        category: 'technical',
      },
      {
        id: '3',
        question: 'Explain the concept of closures in JavaScript with an example.',
        category: 'technical',
      },
      {
        id: '4',
        question: 'What are the main differences between SQL and NoSQL databases?',
        category: 'technical',
      },
      {
        id: '5',
        question: 'How would you optimize the performance of a web application?',
        category: 'technical',
      },
    ],
    behavioral: [
      {
        id: '6',
        question: 'Tell me about a time when you had to work under pressure to meet a deadline.',
        category: 'behavioral',
      },
      {
        id: '7',
        question: 'Describe a situation where you had to resolve a conflict with a team member.',
        category: 'behavioral',
      },
      {
        id: '8',
        question: 'Can you share an example of a project where you took initiative?',
        category: 'behavioral',
      },
      {
        id: '9',
        question: 'Tell me about a time when you failed and what you learned from it.',
        category: 'behavioral',
      },
      {
        id: '10',
        question: 'How do you handle feedback and criticism?',
        category: 'behavioral',
      },
    ],
  };

  return questions[category] || questions.technical;
}
