const formatter = new Intl.NumberFormat('en-US')

export function formatOdo(value: number): string {
  return `${formatter.format(value)} km`
}
