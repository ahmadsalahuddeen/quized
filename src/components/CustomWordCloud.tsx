'use client'
import { useTheme } from 'next-themes';
import React from 'react'
import WordCloud from 'react-d3-cloud';

type Props = {}

const CustomWordCloud = (props: Props) => {
  const theme = useTheme()
  const data = [
    { text: 'falah', value: 3 },

    { text: 'nextjs', value: 11 },
    { text: 'node', value: 8 },
    { text: 'express', value: 2 },
    { text: 'react', value: 1 },
    { text: 'svelte', value: 9 },
  ]

  const fontSizeMapper = (word: {value: number}) => {
      return Math.log2(word.value)   * 5 + 18
  }
  return (
    <>
      <WordCloud
        data={data}
        height={550}
        font="Times"
        fill={theme.theme == 'dark' ? 'white' : 'black'}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
      />
    </>
  )
}

export default CustomWordCloud