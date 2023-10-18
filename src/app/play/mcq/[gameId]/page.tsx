
import MCQ from '@/components/MCQ'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

import React from 'react'

type Props = {
  params: {
    gameId: string
  }
}

const MCQPage = async ({params: {gameId}}: Props) => {
  // islogin validation for the endpoint
  const session = await getAuthSession()
  if(!session?.user)  return redirect('/')
  
  // fetching game data from database
  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        }
      }
    }
  })
  // protecting the route
  if(!game || game.gameType !== 'mcq') redirect('/quiz')


  return <MCQ game={game} />
  
  
}

export default MCQPage