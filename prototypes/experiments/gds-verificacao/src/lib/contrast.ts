// WCAG 2.x — luminância relativa e razão de contraste.
function channel(c: number) {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function parseColor(input: string): [number, number, number] | null {
  const v = input.trim()
  const hex = /^#([0-9a-f]{3,8})$/i.exec(v)
  if (hex) {
    let h = hex[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join('')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const rgb = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(v)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

export function luminance([r, g, b]: [number, number, number]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string) {
  const ca = parseColor(a)
  const cb = parseColor(b)
  if (!ca || !cb) return null
  const [l1, l2] = [luminance(ca), luminance(cb)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'AA texto grande' | 'Falha'

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA texto grande'
  return 'Falha'
}
