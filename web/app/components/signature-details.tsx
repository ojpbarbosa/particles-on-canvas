import type { Signatures } from '@/lib/api'
import { cn } from '@/lib/utils'

type SignatureDetailsProps = {
  signatures: Signatures
  creations?: boolean
}

export default function SignatureDetails({ signatures, creations = false }: SignatureDetailsProps) {
  const strategyToColor: { [key: string]: string } = {
    bw: 'Black and White',
    rgb: 'Red, Green, Blue',
    cmyk: 'Cyan, Magenta, Yellow, Black',
    hsv: 'Hue, Saturation, Value',
    hsl: 'Hue, Saturation, Lightness'
  }

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-x-8 gap-y-4 md:max-w-52 max-w-full',
        creations ? 'md:max-w-52 md:flex-col' : ''
      )}
    >
      <div className="space-y-1 min-w-32">
        <p className="text-sm text-muted-foreground">strategy</p>
        <p className="text-sm font-semibold tracking-tight lowercase">
          {strategyToColor[signatures.strategy]}
        </p>
      </div>
      <div className="space-y-1 min-w-32">
        <p className="text-sm text-muted-foreground">combined velocity (cm per ps)</p>
        <p className="text-sm font-semibold tracking-tight">{signatures.combinedVelocity}</p>
      </div>
      <div className="space-y-1 min-w-52">
        <p className="text-sm text-muted-foreground">layer dimensions</p>
        <p className="text-sm font-semibold tracking-tight">
          <span className="text-muted-foreground">[</span>
          {signatures.layerDimensions.join(', ')}
          <span className="text-muted-foreground">]</span>
        </p>
      </div>
    </div>
  )
}
