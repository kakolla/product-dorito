import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

function Target({
  position,
  pattern,
  moveAngle,
  zigzagSpeed,
  zigzagAmount,
  onHit,
  onExpired,
  spawnTime,
  id,
  meshRef: externalMeshRef
}) {
  const internalMeshRef = useRef()
  const meshRef = externalMeshRef || internalMeshRef
  const timeoutRef = useRef(null)
  const lifespan = 2000 // 2 seconds to hit
  const elapsedTimeRef = useRef(0)
  const startPosition = [...position]

  useEffect(() => {
    // run once when component is mounted
    timeoutRef.current = setTimeout(() => {
      onExpired()
    }, lifespan)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    elapsedTimeRef.current += delta
    const t = elapsedTimeRef.current

    // Convert move angle from degrees to radians
    const angleRad = (moveAngle * Math.PI) / 180

    let offsetX = 0
    let offsetY = 0

    if (pattern === 'serpentine') {
      // Serpentine: Smooth side-to-side movement while traveling in a direction
      // Similar to how League champions dodge skillshots with smooth strafing
      const forwardProgress = t * 0.4 // Forward movement speed
      const zigzag = Math.sin(t * zigzagSpeed) * zigzagAmount

      // Calculate perpendicular direction for zigzag
      const perpAngle = angleRad + Math.PI / 2
      offsetX = Math.cos(angleRad) * forwardProgress + Math.cos(perpAngle) * zigzag
      offsetY = Math.sin(angleRad) * forwardProgress + Math.sin(perpAngle) * zigzag
    } else if (pattern === 'juke') {
      // Juke: Sharp, quick directional changes like a champion dodging
      // Uses a triangle wave for more abrupt direction changes
      const forwardProgress = t * 0.35
      // Triangle wave for sharper turns (more realistic to League juking)
      const triangleWave = (2 / Math.PI) * Math.asin(Math.sin(t * zigzagSpeed * Math.PI))
      const juke = triangleWave * zigzagAmount

      const perpAngle = angleRad + Math.PI / 2
      offsetX = Math.cos(angleRad) * forwardProgress + Math.cos(perpAngle) * juke
      offsetY = Math.sin(angleRad) * forwardProgress + Math.sin(perpAngle) * juke
    }

    meshRef.current.position.x = startPosition[0] + offsetX
    meshRef.current.position.y = startPosition[1] + offsetY
    meshRef.current.position.z = startPosition[2]

    // Pulse effect as time runs out
    const timeLeft = lifespan - elapsedTimeRef.current * 1000
    const pulseFreq = Math.max(1, 5 - (timeLeft / 1000) * 2)
    const scale = 1 + Math.sin(t * pulseFreq * 2) * 0.1
    meshRef.current.scale.set(scale, scale, 1)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[0.2, 64]} />
      <meshBasicMaterial
        color="#ff4655"
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

export default Target
