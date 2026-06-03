'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
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

// DRACO-compressed multi-part shoe — load with draco decoder enabled.
useGLTF.preload('/models/shoe-parts.glb', true)

interface ShoeModelProps {
  zoneColors: Record<string, string>
  zoneMaterials: Record<string, string>
}

function roughnessFor(material: string | undefined): number {
  switch (material) {
    case 'Mesh': return 0.9
    case 'Suede': return 0.95
    case 'Knit': return 0.82
    case 'Synthetic': return 0.5
    case 'Leather': return 0.45
    default: return 0.6
  }
}

function ShoeModel({ zoneColors, zoneMaterials }: ShoeModelProps) {
  const { scene } = useGLTF('/models/shoe-parts.glb', true)
  const group = useRef<THREE.Group>(null)
  const [idle, setIdle] = useState(true)

  // Clone scene + materials; index materials by their part name (laces, mesh, sole...).
  const { cloned, byName, scale } = useMemo(() => {
    const cloned = scene.clone(true)
    const byName: Record<string, THREE.MeshStandardMaterial> = {}
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        const src = mesh.material as THREE.MeshStandardMaterial
        const mat = src.clone()
        mat.envMapIntensity = 1.1
        mesh.material = mat
        if (src.name) byName[src.name] = mat
      }
    })
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { cloned, byName, scale: 3.6 / maxDim }
  }, [scene])

  // Targets keyed by part name.
  const targets = useRef<Record<string, THREE.Color>>({})
  useEffect(() => {
    const t: Record<string, THREE.Color> = {}
    Object.keys(byName).forEach((name) => {
      t[name] = new THREE.Color(zoneColors[name] ?? '#ffffff')
    })
    targets.current = t
    // Material finish (roughness) follows the selected "mesh"/upper material type.
    Object.entries(byName).forEach(([name, mat]) => {
      mat.roughness = roughnessFor(zoneMaterials[name])
    })
  }, [zoneColors, zoneMaterials, byName])

  useFrame((_s, delta) => {
    if (group.current && idle) group.current.rotation.y += delta * 0.4
    Object.entries(byName).forEach(([name, mat]) => {
      const t = targets.current[name]
      if (t && mat.color) mat.color.lerp(t, Math.min(1, delta * 6))
    })
  })

  return (
    <group ref={group} onPointerDown={() => setIdle(false)} position={[0, 0.15, 0]}>
      <Center>
        <primitive object={cloned} scale={scale} rotation={[0.2, -0.4, 0]} />
      </Center>
    </group>
  )
}

interface ShoeViewerProps {
  zoneColors: Record<string, string>
  zoneMaterials: Record<string, string>
}

export default function ShoeViewer({ zoneColors, zoneMaterials }: ShoeViewerProps) {
  return (
    <div
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f3f3f3 0%, #ececec 55%, #e2e2e2 100%)' }}
    >
      <Canvas
        camera={{ position: [2.8, 1.4, 3.6], fov: 40 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.45} />
        <spotLight position={[6, 9, 6]} angle={0.3} penumbra={1} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
        <spotLight position={[-6, 4, -4]} angle={0.4} penumbra={1} intensity={0.9} color="#ff8a8a" />
        <pointLight position={[0, 3, 4]} intensity={0.5} />

        <Suspense fallback={null}>
          <ShoeModel zoneColors={zoneColors} zoneMaterials={zoneMaterials} />
          <Environment resolution={256}>
            <Lightformer intensity={3} position={[0, 5, 2]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.5} position={[-5, 2, 2]} scale={[5, 5, 1]} color="#ffffff" />
            <Lightformer intensity={1} position={[5, 2, -2]} scale={[5, 5, 1]} color="#ff8a8a" />
            <Lightformer intensity={2} position={[0, -3, 1]} scale={[8, 4, 1]} />
          </Environment>
        </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={1024}
            mixBlur={1}
            mixStrength={45}
            roughness={0.9}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#0a0a0a"
            metalness={0.55}
            mirror={0.45}
          />
        </mesh>

        <ContactShadows position={[0, -1.54, 0]} opacity={0.6} scale={9} blur={2.4} far={5} />

        <OrbitControls
          enableZoom
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2 + 0.15}
          target={[0, 0.1, 0]}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#6b6b6b] text-xs uppercase tracking-wider bg-black/40 px-3 py-1.5 pointer-events-none">
        Click + drag to rotate · Scroll to zoom
      </div>
    </div>
  )
}
