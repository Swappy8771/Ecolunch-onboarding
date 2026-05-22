export function InlineLoader({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-label="Loading"
      className="inline-block rounded-full border-2 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: 'var(--accent)',
        borderRightColor: 'var(--accent-border)',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}
