import { Game, Question } from '@prisma/client'
import { differenceInSeconds } from 'date-fns'
import React, { useMemo, useState } from 'react'
import MCQCounter from './MCQCounter'
import { ChevronRight, Loader2, Timer } from 'lucide-react'
import { CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useMutation } from 'react-query'
import { checkAnswerSchema } from '@/app/schemas/question'
import axios from 'axios'

type Props = {
  game: Game & {questions: Pick<Question, 'id' |'question' | 'answer'>[] }
}

const OpenEnded = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setcorrectAnswer] = useState<number>(0);
  const [HasEnded, setHasEnded] = useState<boolean>(false)
  const [now, setNow] = useState<Date>(new Date())

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: '',
      };
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data;
    },
  });
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
        
        <Button
          disabled={isChecking}
          type="button"
          className="mt-2"
          onClick={() => handleNext()}
        >
          {isChecking && <Loader2 className='h-4 w-4 mr-2 animate-spin'/> }
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default OpenEnded