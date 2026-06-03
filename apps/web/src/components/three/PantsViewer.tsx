'use client'

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  Center,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/pants.glb')

const STRETCH = 2.3 // elongate the short-pant model into full-length trousers
const TARGET_HEIGHT = 5.0

function fabricRoughness(fabric: string): number {
  switch (fabric) {
    case 'Denim': return 0.9
    case 'Polyester': return 0.55
    case 'Linen': return 0.85
    case 'Cotton Twill': return 0.8
    default: return 0.8
  }
}

// Procedurally draw 3 fabric-art patterns (grayscale so they tint with any base color).
function makePatternTexture(art: string): THREE.CanvasTexture | null {
  if (!art || art === 'None' || typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 256, 256)

  if (art === 'Floral') {
    const flower = (x: number, y: number, r: number) => {
      ctx.fillStyle = 'rgba(70,70,70,0.5)'
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        ctx.beginPath()
        ctx.ellipse(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.55, r * 0.3, a, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = 'rgba(150,150,150,0.8)'
      ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fill()
    }
    flower(60, 60, 30); flower(190, 110, 34); flower(110, 195, 28); flower(210, 215, 24)
  } else if (art === 'Camo') {
    const tones = ['rgba(120,120,120,0.85)', 'rgba(90,90,90,0.85)', 'rgba(60,60,60,0.85)']
    const blobs = [[50, 50, 40], [150, 70, 55], [90, 160, 50], [200, 180, 45], [30, 200, 35], [220, 40, 30]]
    blobs.forEach(([x, y, r], i) => {
      ctx.fillStyle = tones[i % tones.length]
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * 0.75, i, 0, Math.PI * 2)
      ctx.fill()
    })
  } else if (art === 'Geometric') {
    ctx.strokeStyle = 'rgba(70,70,70,0.6)'
    ctx.lineWidth = 6
    for (let i = -256; i < 256; i += 48) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 256, 256); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(i + 256, 0); ctx.lineTo(i, 256); ctx.stroke()
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 4)
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

interface PantsModelProps {
  primaryColor: string
  secondaryColor: string
  fabric: string
  fit: string
  art: string
}

function PantsModel({ primaryColor, secondaryColor, fabric, fit, art }: PantsModelProps) {
  const { scene } = useGLTF('/models/pants.glb')
  const group = useRef<THREE.Group>(null)

  const { cloned, mats, scale, nat } = useMemo(() => {
    const cloned = scene.clone(true)
    const mats: THREE.MeshStandardMaterial[] = []
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
        mat.map = null
        mat.aoMap = null
        mat.envMapIntensity = 1
        mesh.material = mat
        mats.push(mat)
      }
    })
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const scale = TARGET_HEIGHT / ((size.y || 1) * STRETCH)
    return { cloned, mats, scale }
  }, [scene])

  // Apply fabric finish + art pattern.
  useEffect(() => {
    const tex = makePatternTexture(art)
    mats.forEach((m) => {
      m.roughness = fabricRoughness(fabric)
      m.map = tex
      m.needsUpdate = true
    })
  }, [fabric, art, mats])

  useFrame((_s, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.3
    // Tint every material the same primary color so the whole pant is one clean color.
    const target = new THREE.Color(primaryColor)
    mats.forEach((m) => {
      if (m.color) m.color.lerp(target, Math.min(1, delta * 6))
    })
  })

  const fitX =
    fit === 'Wide-Leg' ? 1.7 :
    fit === 'Slim' ? 1.28 :
    1.4 // Regular — relaxed

  return (
    <group ref={group}>
      <Center>
        <primitive object={cloned} scale={[scale * fitX, scale * STRETCH, scale * fitX]} />
      </Center>
    </group>
  )
}

interface PantsViewerProps {
  primaryColor: string
  secondaryColor: string
  fabric?: string
  fit?: string
  art?: string
}

export default function PantsViewer({ primaryColor, secondaryColor, fabric = 'Cotton Twill', fit = 'Regular', art = 'None' }: PantsViewerProps) {
  return (
    <div
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f3f3f3 0%, #ececec 55%, #e2e2e2 100%)' }}
    >
      <Canvas camera={{ position: [0, 0.2, 8.5], fov: 38 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }} style={{ background: 'transparent' }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[6, 9, 6]} angle={0.3} penumbra={1} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
        <spotLight position={[-6, 4, -4]} angle={0.4} penumbra={1} intensity={0.8} color="#ff8a8a" />
        <pointLight position={[0, 3, 4]} intensity={0.4} />

        <Suspense fallback={null}>
          <PantsModel primaryColor={primaryColor} secondaryColor={secondaryColor} fabric={fabric} fit={fit} art={art} />
          <Environment resolution={256}>
            <Lightformer intensity={2.5} position={[0, 5, 2]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.4} position={[-5, 2, 2]} scale={[5, 5, 1]} />
            <Lightformer intensity={1} position={[5, 2, -2]} scale={[5, 5, 1]} color="#ff8a8a" />
          </Environment>
        </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial blur={[300, 80]} resolution={1024} mixBlur={1} mixStrength={40} roughness={0.9} depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#0a0a0a" metalness={0.5} mirror={0.4} />
        </mesh>

        <ContactShadows position={[0, -2.59, 0]} opacity={0.5} scale={9} blur={2.6} far={6} />
        <OrbitControls enableZoom enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={13} target={[0, 0, 0]} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#6b6b6b] text-xs uppercase tracking-wider bg-black/40 px-3 py-1.5 pointer-events-none">
        Click + drag to rotate · Scroll to zoom
      </div>
    </div>
  )
}
