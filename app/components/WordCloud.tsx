'use client'

import { useMemo } from 'react'
import Link from 'next/link'

interface WordCloudProps {
  words: { text: string; value: number }[]
  maxWords?: number
}

// Deterministic shuffle using string hash (replaces Math.random)
function deterministicShuffle<T>(array: T[]): T[] {
  const result = [...array]
  // Use a simple hash-based shuffle for determinism
  for (let i = result.length - 1; i > 0; i--) {
    // Generate pseudo-random index based on item properties
    const item = result[i]
    const hash = String(item).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const j = hash % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function WordCloud({ words, maxWords = 30 }: WordCloudProps) {
  const sortedWords = useMemo(() => {
    return words
      .sort((a, b) => b.value - a.value)
      .slice(0, maxWords)
  }, [words, maxWords])

  const maxValue = sortedWords[0]?.value || 1
  const minValue = sortedWords[sortedWords.length - 1]?.value || 1

  const getSize = (value: number) => {
    const minSize = 12
    const maxSize = 36
    if (maxValue === minValue) return (minSize + maxSize) / 2
    return minSize + ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize)
  }

  const getColor = (index: number) => {
    const colors = [
      'text-red-600',
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-teal-500',
      'text-blue-500',
      'text-indigo-500',
      'text-purple-500',
      'text-pink-500',
    ]
    return colors[index % colors.length]
  }

  // Use deterministic shuffle instead of Math.random
  const shuffledWords = useMemo(() => {
    return deterministicShuffle(sortedWords)
  }, [sortedWords])

  const toSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-tight">
        {shuffledWords.map((word, index) => (
          <Link
            key={word.text}
            href={`/trends/${toSlug(word.text)}`}
            className={`inline-block ${getColor(index)} hover:scale-110 transition-transform`}
            style={{
              fontSize: `${getSize(word.value)}px`,
              fontWeight: word.value > (maxValue * 0.7) ? 700 : word.value > (maxValue * 0.4) ? 600 : 400,
            }}
            title={`Frequency: ${word.value}`}
          >
            {word.text}
          </Link>
        ))}
      </div>
    </div>
  )
}
