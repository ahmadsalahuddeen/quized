import { NextResponse } from 'next/server';
import { quizCreationSchema } from '@/app/schemas/form/quiz';
import { ZodError } from 'zod';
import { strict_output } from '@/lib/gpt';

// POST api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    let questions: any;
    if (type === 'open-ended') {
      questions = await strict_output(
        'You are a helpful AI that is able to  generate a pair of questions and  answers, the lenght of the answer should not exeed 15 words, store all the pairs of anwers and questions in a JSON array',
        new Array(amount).fill(
          `You are to generate a random hard open-ended question about  ${topic}`
        ),
        {
          question: 'question',
          answer: 'answer with max length of 15 words',
        }
      );
    }else if(type === 'mcq'){
      questions = await strict_output(
        'You are a helpful AI that is able to generate mcq questions and answers, the lenght of the each answer should not exeed 15 words',
        new Array(amount).fill(`You are to generate a  random mcq question about ${topic}`),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "1st option with max length of 15 words",
          option2: "2nd option with max length of 15 words",
          option3: "3rd option with max length of 15 words",
        }
      )
    }
    return NextResponse.json(
      {
        questions,
      },
      {
        status: 200,
      }
    );
   
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
};
