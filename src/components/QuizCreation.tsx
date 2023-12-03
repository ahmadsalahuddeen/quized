'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { quizCreationSchema } from '@/app/schemas/form/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { input, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, CopyCheck } from 'lucide-react';
import { Separator } from './ui/separator';
import { useMutation } from 'react-query';
import axios from 'axios';
import { get } from 'http';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { min } from 'date-fns';
import LoadingQuestions from './LoadingQuestions';

type Props = {
topicParams: string

};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({topicParams}: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [finished, setFinished] = React.useState(false)

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, type, topic }: Input) => {
      const response = await axios.post('/api/game', {
        amount,
        topic,
        type,
      });
      return response.data;
    },
  });
  
  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount:   5,
      topic: topicParams ,
      type: 'mcq',
    },
  });

  const onSubmit = (input : Input) => {
    setShowLoader(true)
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }) => {
          setFinished(true)
          setTimeout(()=>{

            if (form.getValues('type') === 'mcq') {
              router.push(`/play/mcq/${gameId}`);
            } else {
              router.push(`/play/open_ended/${gameId}`);
            }
          }, 1000)
        },
        onError: ( )=>{
          setShowLoader(false)
        }
      }

      );
    };
    form.watch();

if(showLoader){
  return <LoadingQuestions finished={finished} />
}
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2   w-[334px] md:w-96 ">
      <Card className=''>
        <CardHeader>
          <CardTitle className="text-2x font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                  min={form.getValues('type') === 'mcq' ? 5 : 1}
                      
                        max={10}
                        placeholder="Enter an amount.."
                        {...field}
                        onChange={(e) => {
                          form.setValue('amount', parseInt(e.target.value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between   ">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue('type', 'mcq');
                  }}
                  className=" w-1/2   rounded-none rounded-l-lg  "
                  size={'default'}
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                >
                  <CopyCheck className="hidden lg:block w-4 h-4 mr-2 " />{' '}
                  Multiple Choice
                </Button>

                <Separator orientation="vertical" />

                <Button
                  size={'default'}
                  type="button"
                  onClick={() => {
                    form.setValue('type', 'open_ended');
                  }}
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }
                  className="w-1/2  rounded-none rounded-r-lg"
                >
                  <BookOpen className="hidden lg:block w-4 h-4 mr-2 " />
                  Open Ended
                </Button>
              </div>
              {!isLoading ? (
 <Button  type="submit">

 Submit</Button>
              ):(
                <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating Quiz
              </Button>
              )}
             
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
