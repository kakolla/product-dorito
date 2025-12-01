import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const ANCHOR_POINT = [0, 0, 0] // Fixed anchor at origin
const MAX_RANGE = 8 // Maximum trajectory distance
const SPLIT_ANGLE = Math.PI / 6 // 30 degrees for split
const SPLIT_START_PERCENT = 0.7 // Start split preview at 70% of trajectory
const SPLIT_LENGTH_PERCENT = 0.3 // Split branches are 30% of main trajectory length

// Component to show the reticle at anchor point with texture
function ReticleWithTexture({ rotation }) {
  const texture = useTexture('/target_aim_band.png')
  const starTexture = useTexture('/star.png')
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation.current
    }
  })

  // Use a group to rotate around the anchor point
  // Offset the mesh by half its height (0.6) so bottom edge is at anchor
  return (
    <group ref={groupRef} position={ANCHOR_POINT}>
      {/* Star at origin (game anchor) */}
      <sprite position={[0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
        <spriteMaterial map={starTexture} transparent />
      </sprite>
      <mesh position={[0, 0.6, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial map={texture} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Fallback reticle without texture
function ReticleFallback({ rotation }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation.current
    }
  })

  return (
    <group ref={groupRef} position={ANCHOR_POINT}>
      {/* Arrow shaft */}
      <mesh position={[0, 0.4, 0]}>
        <planeGeometry args={[0.08, 0.8]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function AimBand() {
  const { viewport } = useThree()
  const rotationRef = useRef(0)

  useFrame((state) => {
    // Convert mouse pointer to world coordinates
    const cursorX = (state.pointer.x * viewport.width) / 2
    const cursorY = (state.pointer.y * viewport.height) / 2

    // Calculate direction from anchor to cursor
    const dx = cursorX - ANCHOR_POINT[0]
    const dy = cursorY - ANCHOR_POINT[1]
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Normalize direction
    const dirX = distance > 0 ? dx / distance : 1
    const dirY = distance > 0 ? dy / distance : 0

    // Calculate rotation angle (atan2 gives angle in radians)
    // Subtract PI/2 because the asset/arrow points up by default (we want it pointing right at 0 degrees)
    const angle = Math.atan2(dy, dx) - Math.PI / 2
    rotationRef.current = angle

    // Store direction for projectile shooting (expose to parent)
    if (window.__aimDirection === undefined) {
      window.__aimDirection = { x: 0, y: 0 }
    }
    window.__aimDirection.x = dirX
    window.__aimDirection.y = dirY
  })

  return (
    <Suspense fallback={<ReticleFallback rotation={rotationRef} />}>
      <ReticleWithTexture rotation={rotationRef} />
    </Suspense>
  )
}

export default AimBand
