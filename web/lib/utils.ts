import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fisherYatesShuffle<T>(array: T[]) {
  let i = array.length,
    j: number,
    k: T

  while (i) {
    j = Math.floor(Math.random() * i--)
    k = array[i]
    array[i] = array[j]
    array[j] = k
  }

  return array
}
