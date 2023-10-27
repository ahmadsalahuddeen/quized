import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { Target } from 'lucide-react'

type Props = {}

const AccuracyCard = (props: Props) => {
  return (
<Card className='md:col-span-3'>
  <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0' >
    <CardTitle className='text-2xl font-bold'>Average Accuracy</CardTitle>
    <Target/>
  </CardHeader>
</Card>
  )
}

export default AccuracyCard