import { getAuthSession } from '@/lib/nextauth'
import React from 'react'
import { redirect } from 'next/navigation'
import QuizCreation from '@/components/QuizCreation'
type Props = {}

export const metadata = {
  title: 'Quiz | Quized'
}
const QuizPage = async (props: Props) => {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect('/');
  }
  return (
      <QuizCreation />
  )
}

export default QuizPage