import { checkAnswerSchema } from '@/app/schemas/question';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { compareTwoStrings } from 'string-similarity';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        {
          error: 'Question not found',
        },
        {
          status: 404,
        }
      );
    }
    await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer },
    });

    // checking answer - mcq
    if (question.questionType === 'mcq') {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();

      // updating userAnswer's result in DB
      await prisma.question.update({
        where: {
          id: questionId,
        },
        data: { isCorrect },
      });
      return NextResponse.json(
        {
          isCorrect: isCorrect,
        },
        {
          status: 200,
        }
      );
    } else if (question.questionType === 'open_ended') {
      let percentageSimilar = compareTwoStrings(
        userAnswer.toLowerCase().trim(),
        question.answer.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });

      return NextResponse.json(
        {
          percentageSimilar,
        },
        {
          status: 200,
        }
      );
    }
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
    // For logs purpose
    console.log(error);
    // You should return a response in all cases
    return NextResponse.json(
      {
        error: 'Unexpected error occured',
      },
      {
        status: 500,
      }
    );
  }
}
