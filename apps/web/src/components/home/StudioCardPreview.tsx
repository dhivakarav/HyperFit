'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/shoe-parts.glb', true)
useGLTF.preload('/models/tshirt.glb')
useGLTF.preload('/models/pants.glb')

// A designed default colorway so the shoe preview looks intentional.
const SHOE_COLORS: Record<string, string> = {
  mesh: '#f8f8f8', laces: '#0a0a0a', caps: '#0a0a0a', stripes: '#c8102e',
  sole: '#ffffff', band: '#0a0a0a', patch: '#c8102e', inner: '#1c1c1c',
}

function AutoRotate({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_s, d) => { if (ref.current) ref.current.rotation.y += d * speed })
  return <group ref={ref}>{children}</group>
}

function ShoeModel() {
  const { scene } = useGLTF('/models/shoe-parts.glb', true)
  const { cloned, scale } = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        const src = m.material as THREE.MeshStandardMaterial
        const mat = src.clone()
        if (src.name && SHOE_COLORS[src.name]) mat.color = new THREE.Color(SHOE_COLORS[src.name])
        m.material = mat
      }
    })
    const box = new THREE.Box3().setFromObject(cloned)
    const s = new THREE.Vector3(); box.getSize(s)
    return { cloned, scale: 3.4 / Math.max(s.x, s.y, s.z) }
  }, [scene])
  return <Center><primitive object={cloned} scale={scale} rotation={[0.2, -0.4, 0]} /></Center>
}

function TeeModel() {
  const { nodes, materials } = useGLTF('/models/tshirt.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>; materials: Record<string, THREE.MeshStandardMaterial>
  }
  const { geometry, material, scale } = useMemo(() => {
    const mesh = nodes.T_Shirt_male
    const material = materials.lambert1.clone()
    material.map = null; material.aoMap = null
    material.color = new THREE.Color('#c8102e'); material.roughness = 0.85
    const box = new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position as THREE.BufferAttribute)
    const s = new THREE.Vector3(); box.getSize(s)
    return { geometry: mesh.geometry, material, scale: 2.5 / Math.max(s.x, s.y, s.z) }
  }, [nodes, materials])
  return <Center><mesh geometry={geometry} material={material} scale={scale} /></Center>
}

function PantsModel() {
  const { scene } = useGLTF('/models/pants.glb')
  const STRETCH = 2.3
  const { cloned, scale } = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        const mat = (m.material as THREE.MeshStandardMaterial).clone()
        mat.map = null; mat.aoMap = null
        mat.color = new THREE.Color('#cdbb9a')
        m.material = mat
      }
    })
    const box = new THREE.Box3().setFromObject(cloned)
    const s = new THREE.Vector3(); box.getSize(s)
    return { cloned, scale: 5 / ((s.y || 1) * STRETCH) }
  }, [scene])
  return <Center><primitive object={cloned} scale={[scale, scale * STRETCH, scale]} /></Center>
}

const CAMERAS: Record<string, { position: [number, number, number]; fov: number }> = {
  shoes: { position: [2.6, 1.3, 3.4], fov: 40 },
  tshirt: { position: [0, 0, 4.2], fov: 40 },
  pants: { position: [0, 0, 9], fov: 36 },
}

export default function StudioCardPreview({ type }: { type: 'shoes' | 'tshirt' | 'pants' }) {
  return (
    <Canvas
      camera={CAMERAS[type]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} />
      <directionalLight position={[-5, 2, -4]} intensity={0.45} color="#ffd5d5" />
      <pointLight position={[0, 3, 4]} intensity={0.4} />
      <Suspense fallback={null}>
        <AutoRotate>
          {type === 'shoes' ? <ShoeModel /> : type === 'tshirt' ? <TeeModel /> : <PantsModel />}
        </AutoRotate>
      </Suspense>
    </Canvas>
  )
}
