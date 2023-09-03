import React from 'react';
import { useForm } from 'react-hook-form';
import { quizCreationSchema } from '@/app/schemas/form/quiz';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'


type Props = {};

type input = z.infer<typeof quizCreationSchema>

const QuizCreation = (props: Props) => {
  const form = useForm<input>({
     resolver: zodResolver(quizCreationSchema),
     defaultValues:{
      amount: 3,
      topic: '',
      type: 'open-ended'
     }
  });
  return (
    <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
