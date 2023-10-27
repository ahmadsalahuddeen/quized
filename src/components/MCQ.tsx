'use client';
import { differenceInSeconds } from 'date-fns';
import { Game, Question } from '@prisma/client';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'sonner';
import z, { boolean, coerce } from 'zod';
import { checkAnswerSchema, endGameSchema } from '@/app/schemas/question';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';
import { prisma } from '@/lib/db';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswer, setcorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setwrongAnswer] = useState<number>(0);
  const [HasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!HasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [HasEnded]);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion, questionIndex]);

  // api call to check/validate user's answer input
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data;
    },
  });

  // API to update game endTime
  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  // next button handler,
  const handleNext = useCallback(() => {
    if (isChecking) return; // to avoid spam button click
    checkAnswer(undefined, {
      onSuccess: async ({ isCorrect }) => {
        if (isCorrect) {
          toast.success('Correct!', {
            position: 'top-center',
            description: 'Correct Answer 🥳',
          });
          setcorrectAnswer((prev) => prev + 1);
        } else {
          toast.error('Wrong!', {
            position: 'top-center',
            description: 'Wrong answer👀',
          });

          setwrongAnswer((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          endGame()
          setHasEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length]);

  // keydown effect
  React.useEffect(() => {
    // enabling keypress support to select answer
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key == '1') {
        setSelectedChoice(0);
      } else if (event.key == '2') {
        setSelectedChoice(1);
      } else if (event.key == '3') {
        setSelectedChoice(2);
      } else if (event.key == '4') {
        setSelectedChoice(3);
      } else if (event.key == 'Enter') {
        handleNext();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleNext]);
  if (HasEnded)
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap ">
          You Completed in{' '}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), 'mt-2')}
        >
          View statistics
          <BarChart className="ml-2 w-4 h-4" />
        </Link>
      </div>
    );

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic*/}
          <p>
            <span className="py-1 px-3 text-white rounded-lg bg-slate-800">
              <span className="text-slate-400 text-sm">Topic: </span>
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter correctAnswer={correctAnswer} wrongAnswer={wrongAnswer} />
      </div>

      <Card className="w-full mt-4">
        {/* question */}
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50 ">
            <div> {questionIndex + 1}</div>
            <div className="text-slate-400 text-base ">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      {/* options */}
      <div className="flex flex-col w-full items-center justify-center mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              type="button"
              className="justify-start w-full py-8 mb-4"
              variant={selectedChoice === index ? 'default' : 'secondary'}
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-5 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          disabled={isChecking}
          type="button"
          className="mt-2"
          onClick={() => handleNext()}
        >
          {isChecking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
