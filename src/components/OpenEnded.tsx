'use client';
import { Game, Question } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import MCQCounter from './MCQCounter';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { useMutation } from 'react-query';
import { checkAnswerSchema } from '@/app/schemas/question';
import axios from 'axios';
import { cn, formatTimeDelta } from '@/lib/utils';
import z from 'zod';
import { toast } from 'sonner';
import BlankAnwerInput from './BlankAnwerInput';
import Link from 'next/link';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] };
};

const OpenEnded = ({ game }: Props) => {
  const [blankAnswer, setBlankAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setcorrectAnswer] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());
  const [HasEnded, setHasEnded] = useState<boolean>(false);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  // timer interval
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

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll('#user-blank-input').forEach((input) => {
        filledAnswer = filledAnswer.replace('_____', input.value);
        input.value = '';
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data;
    },
  });

  // next button handler,
  const handleNext = useCallback(() => {
    if (isChecking) return; // to avoid spam button click

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast.success(
          `Your answer is ${percentageSimilar}% similar to correct answer.`,
          { description: 'answer are matched based on similarity comparisons' }
        );
        if (questionIndex === game.questions.length - 1) {
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
      if (event.key == 'Enter') {
        handleNext();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleNext]);

  //  returns the result page completing every question
  if(HasEnded) return (
    <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="px-4 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap ">
        You Completed in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
      </div>
      <Link href={`/statistics/${game.id}`} className={cn( buttonVariants(), 'mt-2')}>
      View statistics
      <BarChart className='ml-2 w-4 h-4'/>

      </Link>
    </div>
  )


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
        <BlankAnwerInput
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />
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

export default OpenEnded;
