'use client';
import React from 'react';
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

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
  const router = useRouter();

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
      amount: 3,
      topic: '',
      type: 'open_ended',
    },
  });

  const onSubmit = ({ amount, topic, type }: Input) => {
    getQuestions(
      {
        amount,
        topic,
        type,
      },
      {
        onSuccess: ({ gameId }) => {
          if (form.getValues('type') === 'mcq') {
            router.push(`/play/mcq/${gameId}`);
          } else {
            router.push(`/play/open_ended/${gameId}`);
          }
        },
      }
    );
  };

  form.watch();

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
      <Card>
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
                        min={1}
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
              <div className="flex justify-between  ">
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
                  <CopyCheck className="hidden lg:block w-4 h-4 mr-2" />{' '}
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
