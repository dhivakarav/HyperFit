/**
 * Captures a small JPEG thumbnail of the customizer's 3D <canvas> so it can be
 * stored on the cart item (and persisted in localStorage) without bloating it.
 *
 * Requires the R3F <Canvas> to be created with `gl={{ preserveDrawingBuffer: true }}`,
 * otherwise the WebGL drawing buffer is cleared after each frame and the capture
 * comes out blank.
 */
export function snapshotCanvas(maxWidth = 420): string | undefined {
  if (typeof document === 'undefined') return undefined
  // The customizer page renders exactly one 3D canvas.
  const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
  if (!canvas || !canvas.width || !canvas.height) return undefined
  try {
    const scale = Math.min(1, maxWidth / canvas.width)
    const off = document.createElement('canvas')
    off.width = Math.max(1, Math.round(canvas.width * scale))
    off.height = Math.max(1, Math.round(canvas.height * scale))
    const ctx = off.getContext('2d')
    if (!ctx) return undefined
    // Fill a light backdrop so transparent areas don't render black in the cart.
    ctx.fillStyle = '#f2f2f2'
    ctx.fillRect(0, 0, off.width, off.height)
    ctx.drawImage(canvas, 0, 0, off.width, off.height)
    return off.toDataURL('image/jpeg', 0.82)
  } catch {
    return undefined
  }
}
