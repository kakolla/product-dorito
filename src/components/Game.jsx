import React, { useState, useEffect, useRef } from 'react'
import Target from './Target'
import AimBand from './AimBand'
import Projectile from './Projectile'

// Target configurations - change daily
// Each target has: position, movement pattern, and pattern parameters
const TARGET_CONFIGS = [
  {
    position: [-2.4, 1.3, 0],
    pattern: 'serpentine', // Left-right zigzag while moving
    moveAngle: 45, // Direction of overall movement (degrees)
    zigzagSpeed: 1.5, // How fast they zigzag
    zigzagAmount: 0.6 // How far they zigzag
  },
  {
    position: [1.8, -0.9, 0],
    pattern: 'juke', // Quick directional changes
    moveAngle: 135,
    zigzagSpeed: 2.5,
    zigzagAmount: 0.4
  },
  {
    position: [-0.5, 1.7, 0],
    pattern: 'serpentine',
    moveAngle: -90,
    zigzagSpeed: 2,
    zigzagAmount: 0.5
  },
  {
    position: [2.7, 0.4, 0],
    pattern: 'juke',
    moveAngle: 180,
    zigzagSpeed: 3,
    zigzagAmount: 0.7
  },
  {
    position: [-1.2, -1.5, 0],
    pattern: 'serpentine',
    moveAngle: 0,
    zigzagSpeed: 1.8,
    zigzagAmount: 0.55
  },
  {
    position: [0.9, 1.1, 0],
    pattern: 'juke',
    moveAngle: -45,
    zigzagSpeed: 2.2,
    zigzagAmount: 0.65
  }
]

const MAX_TARGETS = 6 // Total number of targets for the game
const SHOT_COOLDOWN = 500 // Cooldown between shots in milliseconds (0.5 seconds)

function Game({ onTargetHit, onTargetExpired, onGameComplete }) {
  const [targets, setTargets] = useState([])
  const [projectiles, setProjectiles] = useState([])
  const nextIdRef = useRef(0)
  const nextProjectileIdRef = useRef(0)
  const positionIndexRef = useRef(0)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)
  const targetRefsRef = useRef({})
  const targetsSpawnedRef = useRef(0)
  const lastShotTimeRef = useRef(0)

  const getNextTargetConfig = () => {
    const config = TARGET_CONFIGS[positionIndexRef.current % TARGET_CONFIGS.length]
    positionIndexRef.current = (positionIndexRef.current + 1) % TARGET_CONFIGS.length
    return config
  }

  const spawnTarget = () => {
    if (!mountedRef.current) return
    if (targetsSpawnedRef.current >= MAX_TARGETS) return // Stop spawning after 6 targets

    const id = nextIdRef.current
    const meshRef = React.createRef()
    const config = getNextTargetConfig()
    const newTarget = {
      id,
      position: config.position,
      pattern: config.pattern,
      moveAngle: config.moveAngle,
      zigzagSpeed: config.zigzagSpeed,
      zigzagAmount: config.zigzagAmount,
      spawnTime: Date.now(),
      meshRef
    }
    targetRefsRef.current[id] = meshRef
    setTargets(prevTargets => [...prevTargets, newTarget])
    nextIdRef.current += 1
    targetsSpawnedRef.current += 1
  }

  useEffect(() => {
    mountedRef.current = true

    // Spawn first target immediately
    spawnTarget()

    // Keep spawning new targets continuously
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        spawnTarget()
      }
    }, 2000) // Spawn every 2 seconds for skillshot gameplay

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleTargetHit = (targetId) => {
    const target = targets.find(t => t.id === targetId)
    if (target) {
      // Calculate points based on reaction time
      // Faster kills = higher score (max 100 points per target)
      const reactionTime = Date.now() - target.spawnTime // in ms
      const points = Math.max(10, Math.floor(100 - reactionTime / 50))

      setTargets(prev => {
        const newTargets = prev.filter(t => t.id !== targetId)
        // Check if game is complete (all targets spawned and destroyed)
        if (newTargets.length === 0 && targetsSpawnedRef.current >= MAX_TARGETS) {
          if (onGameComplete) onGameComplete()
        }
        return newTargets
      })
      delete targetRefsRef.current[targetId]
      onTargetHit(points)
    }
  }

  const handleTargetExpired = (targetId) => {
    setTargets(prev => {
      const newTargets = prev.filter(t => t.id !== targetId)
      // Check if game is complete (all targets spawned and destroyed/expired)
      if (newTargets.length === 0 && targetsSpawnedRef.current >= MAX_TARGETS) {
        if (onGameComplete) onGameComplete()
      }
      return newTargets
    })
    delete targetRefsRef.current[targetId]
    onTargetExpired()
  }

  const shootProjectile = useRef(() => {
    // Check cooldown
    const currentTime = Date.now()
    if (currentTime - lastShotTimeRef.current < SHOT_COOLDOWN) {
      return // Still on cooldown, ignore this shot
    }

    lastShotTimeRef.current = currentTime

    // Get current aim direction from AimBand
    const aimDir = window.__aimDirection || { x: 1, y: 0 }

    const id = nextProjectileIdRef.current
    nextProjectileIdRef.current += 1

    const newProjectile = {
      id,
      startPos: [0, 0, 0],
      directionX: aimDir.x,
      directionY: aimDir.y
    }

    setProjectiles(prev => [...prev, newProjectile])
  })

  // Expose shoot function globally
  useEffect(() => {
    window.__gameShootProjectile = shootProjectile.current
    return () => {
      window.__gameShootProjectile = null
    }
  }, [])

  const removeProjectile = (projectileId) => {
    setProjectiles(prev => prev.filter(p => p.id !== projectileId))
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Aim band that follows cursor */}
      <AimBand />

      {/* Targets */}
      {targets.map(target => (
        <Target
          key={target.id}
          id={target.id}
          position={target.position}
          pattern={target.pattern}
          moveAngle={target.moveAngle}
          zigzagSpeed={target.zigzagSpeed}
          zigzagAmount={target.zigzagAmount}
          spawnTime={target.spawnTime}
          meshRef={target.meshRef}
          onHit={() => handleTargetHit(target.id)}
          onExpired={() => handleTargetExpired(target.id)}
        />
      ))}

      {/* Projectiles */}
      {projectiles.map(projectile => (
        <Projectile
          key={projectile.id}
          startPos={projectile.startPos}
          directionX={projectile.directionX}
          directionY={projectile.directionY}
          targets={targets}
          onTargetHit={handleTargetHit}
          onComplete={() => removeProjectile(projectile.id)}
        />
      ))}
    </>
  )
}

export default Game
