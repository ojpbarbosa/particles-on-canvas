import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Theme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col gap-y-3">
      <h4 className="text-sm font-medium h-4">theme</h4>
      <div className="text-muted-foreground flex flex-row items-center gap-x-2">
        <ul className="flex flex-col items-start gap-y-3">
          <li>
            <a
              onClick={() => setTheme('light')}
              className={cn(
                'text-muted- hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                theme === 'light' && mounted && 'text-foreground underline underline-offset-4'
              )}
            >
              light
            </a>
          </li>
          <li>
            <a
              onClick={() => setTheme('dark')}
              className={cn(
                'text-muted-foreground hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                theme === 'dark' && mounted && 'text-foreground underline underline-offset-4'
              )}
            >
              dark
            </a>
          </li>
          <li>
            <a
              onClick={() => setTheme('system')}
              className={cn(
                'text-muted-foreground hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                theme === 'system' && mounted && 'text-foreground underline underline-offset-4'
              )}
            >
              system
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
