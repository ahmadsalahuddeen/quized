import { quizCreationSchema } from '@/app/schemas/form/quiz';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { Prisma } from '@prisma/client';
import axios from 'axios';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'you are not logged in ',
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'something went wrong ',
      },
      { status: 500 }
    );
  }
}
