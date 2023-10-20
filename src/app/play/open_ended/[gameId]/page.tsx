

import OpenEnded from '@/components/OpenEnded'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

import React from 'react'

type Props = {
  params: {
    gameId: string
  }
}

const OpenEndedPage = async ({params: {gameId}}: Props) => {
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
          answer: true

        }
      }
    }
  })
  // protecting the route
  if(!game || game.gameType !== 'open_ended') redirect('/quiz')


  return <OpenEnded game={game} />
  
  
}

export default OpenEndedPage