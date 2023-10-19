'use client';
import { Game, Question } from '@prisma/client';
import { ChevronRight, Timer } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'sonner';
import z from 'zod';
import { checkAnswerSchema } from '@/app/schemas/question';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswer, setcorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setwrongAnswer] = useState<number>(0);

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

  // next button handler,
  const handleNext = useCallback(() => {
    if(isChecking) return // to avoid spam button click
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast.success('Correct!', { position: 'top-center', description: 'Correct Answer 🥳'});
          setcorrectAnswer((prev) => prev + 1);
        } else {
          toast.error('Wrong!', { position: 'top-center', description: 'i know it hurts💀'} );

          setwrongAnswer((prev) => prev + 1);
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer]);

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
            <span>00:00</span>
          </div>
        </div>
        <MCQCounter correctAnswer={3} wrongAnswer={4} />
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
        type='button'
        className="mt-2" 
        onClick={() => handleNext()}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
