
import { getAuthSession } from '@/lib/nextauth'
import React from 'react'
import { redirect } from 'next/navigation'
import QuizMeCard from '@/components/dashboard/QuizMeCard'
import HistoryCard from '@/components/dashboard/HistoryCard'
import HotTopicCard from '@/components/dashboard/HotTopicCard'
import RecentActivity from '@/components/dashboard/RecentActivity'

type Props = {}

export const metadata = {
  title: 'Dashboard | Quized',
  
}

const Dashboard = async (props: Props) => {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect('/');
  }
  return (

    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex  items-center">
        <h2 className="mr-2 text-3xl  font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
        
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicCard/>
        <RecentActivity/>
      </div>

    </main>
  )
}

export default Dashboard