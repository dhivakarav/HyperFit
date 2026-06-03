'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, useGLTF, Center, Decal, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/tshirt.glb')

// Canvas font family names → font file URLs (loaded via FontFace at runtime).
const FONT_FACES: Record<string, { family: string; url: string }> = {
  Bebas: { family: 'HF-Bebas', url: '/fonts/BebasNeue.ttf' },
  Anton: { family: 'HF-Anton', url: '/fonts/Anton.ttf' },
  Pacifico: { family: 'HF-Pacifico', url: '/fonts/Pacifico.ttf' },
}

const FIT_SCALE: Record<string, [number, number, number]> = {
  Regular: [1, 1, 1],
  Oversized: [1.12, 1.02, 1.12],
  Slim: [0.9, 1, 0.9],
  Cropped: [1, 0.82, 1],
}

function contrastText(hex: string): string {
  const c = new THREE.Color(hex)
  const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b
  return lum > 0.6 ? '#0a0a0a' : '#f8f8f8'
}

function makeTextTexture(text: string, family: string, color: string, fontsReady: boolean): THREE.CanvasTexture | null {
  if (!text || typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Shrink font to fit width
  let size = 240
  ctx.font = `${size}px "${family}"`
  while (ctx.measureText(text).width > 960 && size > 40) {
    size -= 20
    ctx.font = `${size}px "${family}"`
  }
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 4
  tex.needsUpdate = true
  // fontsReady is a dependency so the texture regenerates once fonts load
  void fontsReady
  return tex
}

function fabricRoughness(fabric: string): number {
  switch (fabric) {
    case 'Dry-fit': return 0.45
    case 'Polyester Blend': return 0.6
    case 'Bamboo': return 0.8
    case 'Cotton': return 0.92
    default: return 0.85
  }
}

interface ShirtProps {
  baseColor: string
  frontText: string
  backText: string
  font: string
  fit: string
  fabric: string
}

function Shirt({ baseColor, frontText, backText, font, fit, fabric }: ShirtProps) {
  const group = useRef<THREE.Group>(null)
  const [fontsReady, setFontsReady] = useState(false)
  const { nodes, materials } = useGLTF('/models/tshirt.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.MeshStandardMaterial>
  }

  // Load the 3 fonts once for canvas rendering.
  useEffect(() => {
    let active = true
    Promise.all(
      Object.values(FONT_FACES).map(({ family, url }) => new FontFace(family, `url(${url})`).load())
    )
      .then((faces) => {
        if (!active) return
        faces.forEach((f) => (document as unknown as { fonts: FontFaceSet }).fonts.add(f))
        setFontsReady(true)
      })
      .catch(() => setFontsReady(true))
    return () => { active = false }
  }, [])

  const { geometry, material, scale } = useMemo(() => {
    const mesh = nodes.T_Shirt_male
    const material = materials.lambert1.clone()
    // The model ships with baked lighting/AO in its textures — strip them so the
    // shirt is a clean solid color shaded by our real-time lights (no dark blob).
    material.map = null
    material.aoMap = null
    material.emissiveMap = null
    material.emissive = new THREE.Color('#000000')
    material.metalness = 0
    material.roughness = 0.85
    const box = new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position as THREE.BufferAttribute)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { geometry: mesh.geometry, material, scale: 2.6 / maxDim }
  }, [nodes, materials])

  // Fabric choice changes the surface finish.
  useEffect(() => {
    material.roughness = fabricRoughness(fabric)
  }, [fabric, material])

  const family = FONT_FACES[font]?.family ?? FONT_FACES.Bebas.family
  const textColor = contrastText(baseColor)
  const frontTex = useMemo(() => makeTextTexture(frontText, family, textColor, fontsReady), [frontText, family, textColor, fontsReady])
  const backTex = useMemo(() => makeTextTexture(backText, family, textColor, fontsReady), [backText, family, textColor, fontsReady])

  useFrame((_s, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25
    material.color.lerp(new THREE.Color(baseColor), Math.min(1, delta * 6))
  })

  const fitScale = FIT_SCALE[fit] ?? FIT_SCALE.Regular
  const groupScale: [number, number, number] = [scale * fitScale[0], scale * fitScale[1], scale * fitScale[2]]

  return (
    <group ref={group}>
      <Center>
        <group scale={groupScale}>
          <mesh geometry={geometry} material={material} castShadow receiveShadow>
            {frontTex && (
              <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={[0.22, 0.11, 0.22]}>
                <meshStandardMaterial map={frontTex} transparent polygonOffset polygonOffsetFactor={-10} roughness={0.8} toneMapped={false} />
              </Decal>
            )}
            {backTex && (
              <Decal position={[0, 0.04, -0.15]} rotation={[0, Math.PI, 0]} scale={[0.22, 0.11, 0.22]}>
                <meshStandardMaterial map={backTex} transparent polygonOffset polygonOffsetFactor={-10} roughness={0.8} toneMapped={false} />
              </Decal>
            )}
          </mesh>
        </group>
      </Center>
    </group>
  )
}

interface TShirtViewerProps {
  baseColor: string
  frontText: string
  backText: string
  font: string
  fit?: string
  sleeve?: string
  collar?: string
  pocket?: string
  fabric?: string
}

export default function TShirtViewer({ baseColor, frontText, backText, font, fit = 'Regular', fabric = 'Cotton' }: TShirtViewerProps) {
  return (
    <div
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f3f3f3 0%, #ececec 55%, #e2e2e2 100%)' }}
    >
      <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} style={{ background: 'transparent' }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <spotLight position={[5, 8, 6]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
        <spotLight position={[-5, 3, -4]} angle={0.4} penumbra={1} intensity={0.7} color="#ff8a8a" />

        <Suspense fallback={null}>
          <Shirt baseColor={baseColor} frontText={frontText} backText={backText} font={font} fit={fit} fabric={fabric} />
          <Environment resolution={256}>
            <Lightformer intensity={2.5} position={[0, 5, 2]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.4} position={[-5, 2, 2]} scale={[5, 5, 1]} />
            <Lightformer intensity={1} position={[5, 2, -2]} scale={[5, 5, 1]} color="#ff8a8a" />
          </Environment>
        </Suspense>

        <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={8} blur={2.6} far={4} />
        <OrbitControls enableZoom enablePan={false} enableDamping dampingFactor={0.08} minDistance={3} maxDistance={8} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#6b6b6b] text-xs uppercase tracking-wider bg-black/40 px-3 py-1.5 pointer-events-none">
        Click + drag to rotate · Scroll to zoom
      </div>
    </div>
  )
}
