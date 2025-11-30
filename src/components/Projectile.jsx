import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const PROJECTILE_SPEED = 8 // Units per second
const MAX_DISTANCE = 8 // Must match MAX_RANGE from AimBand
const COLLISION_RADIUS = 0.3 // Collision detection radius

function Projectile({ startPos, directionX, directionY, onComplete, targets, onTargetHit }) {
  const meshRef = useRef()
  const distanceTraveled = useRef(0)

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    // Move projectile along direction
    const moveAmount = PROJECTILE_SPEED * delta
    meshRef.current.position.x += directionX * moveAmount
    meshRef.current.position.y += directionY * moveAmount
    distanceTraveled.current += moveAmount

    // Check collision with targets
    if (targets && targets.length > 0) {
      for (const target of targets) {
        if (target.meshRef && target.meshRef.current) {
          const dx = meshRef.current.position.x - target.meshRef.current.position.x
          const dy = meshRef.current.position.y - target.meshRef.current.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < COLLISION_RADIUS) {
            onTargetHit(target.id)
            onComplete()
            return
          }
        }
      }
    }

    // Remove projectile if it traveled max distance
    if (distanceTraveled.current >= MAX_DISTANCE) {
      onComplete()
    }
  })

  return (
    <group ref={meshRef} position={startPos}>
      {/* Main projectile sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.10, 16, 16]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>

      {/* Point light for additional glow */}
      <pointLight color="#00d4ff" intensity={1.5} distance={1} />
    </group>
  )
}

export default Projectile
