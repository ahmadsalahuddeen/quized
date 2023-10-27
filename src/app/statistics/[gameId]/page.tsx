import React from 'react'

type Props = {
  params: {
    gameId: string
  }
}

const StatisticsPage = ({params: {gameId}}: Props) => {
  return (
    <div>{gameId}</div>
  )
}

export default StatisticsPage