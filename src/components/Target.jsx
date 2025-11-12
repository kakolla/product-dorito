import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

function Target({ position, onHit, onExpired, spawnTime }) {
  const meshRef = useRef()
  const timeoutRef = useRef(null)
  const lifespan = 1000 // 1000 ms to click

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

  useFrame((state) => {
    if (!meshRef.current) return


  })

  const handleClick = (e) => {
    e.stopPropagation() // don't bubble up event up to parent components

    // clear expiration timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Calculate points based on reaction time
    const reactionTime = Date.now() - spawnTime
    const points = Math.max(100, Math.floor(1000 - reactionTime))

    // Remove target and add points
    onHit(points)
  }

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <circleGeometry args={[0.3, 64]} />
      <meshBasicMaterial
        color="#ff4655"
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

export default Target
