'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = {}

const RecentActivity = (props: Props) => {
  
  return (
    
<Card className='col-span-4 lg:col-span-3'>
  <CardHeader>
    <CardTitle className='text-2xl'>
Recent Activity
    </CardTitle>
    <CardDescription>
you have played a total of 7 games
    </CardDescription>
  </CardHeader>
  <CardContent  className='max-h-[580px]  overflow-scroll overflow-hidden '>

    historiees
  </CardContent>
</Card>
  )
}

export default RecentActivity