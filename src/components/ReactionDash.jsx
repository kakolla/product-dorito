import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const PLAYER_SPEED = 2 // Base movement speed
const TELEGRAPH_DELAY = 0.4 // Time before telegraph explodes (seconds)
const TELEGRAPH_SPAWN_INTERVAL = 0.8 // Time between telegraph spawns (seconds)
const MAP_SIZE = 4 // Half-size of playable area
const MAX_SIMULTANEOUS_TELEGRAPHS = 3 // Max telegraphs that can spawn at once

// Worlds Highlight Moments configuration
const HIGHLIGHTS = {
  praygorilla: {
    key: 'space',
    name: 'Miracle Hold',
    year: 'ROX 2016',
    description: '0.15s grace period on direct spawns',
    type: 'passive' // Always active
  },
  ambition: {
    key: 'shift',
    name: "Ambition's Path to Triumph",
    year: 'SSG 2017',
    description: 'First dodge after 5s gives 0.3s speed burst',
    type: 'triggered' // Triggers automatically under conditions
  },
  theshy: {
    key: 'e',
    name: 'Fearless Engage',
    year: 'iG 2018',
    description: 'Recoil dash when touching telegraph edge',
    type: 'passive' // Always active
  },
  zeka: {
    key: 'q',
    name: 'Limit Break',
    year: 'DRX 2022',
    description: 'Stand still 0.4s to prime burst dash',
    type: 'active' // Manual activation
  },
  ruler: {
    key: 'w',
    name: 'Last-Shot Instinct',
    year: 'GEN 2023',
    description: 'Narrow dodge gives 0.2s speed spike',
    type: 'passive' // Always active
  }
}

// Telegraph component - danger zone that explodes after delay
function Telegraph({ position, spawnTime, onExplode, id, radius }) {
  const outerRingRef = useRef()
  const innerFillRef = useRef()
  const exploded = useRef(false)

  useFrame((state) => {
    if (!outerRingRef.current || !innerFillRef.current) return

    const currentTime = state.clock.elapsedTime
    const elapsed = currentTime - spawnTime
    const explodeTime = TELEGRAPH_DELAY

    if (elapsed >= explodeTime && !exploded.current) {
      exploded.current = true
      onExplode(id, position, radius)
    }

    if (elapsed < explodeTime) {
      // Show hollow ring at full size immediately
      const progress = elapsed / explodeTime

      // Outer ring stays constant
      outerRingRef.current.scale.set(1, 1, 1)

      // Inner fill grows from 0 to full size over the delay
      const fillScale = progress
      innerFillRef.current.scale.set(fillScale, fillScale, 1)
      innerFillRef.current.material.opacity = 0.3 + progress * 0.3
    } else {
      // On explosion, fill becomes fully opaque
      innerFillRef.current.material.opacity = 0.8
      outerRingRef.current.material.opacity = 1
    }
  })

  return (
    <group position={[position[0], position[1], 0]}>
      {/* Outer hollow ring - white */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[radius * 0.95, radius, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Inner fill - red */}
      <mesh ref={innerFillRef}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color="#ff3333" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Player component with movement and highlight mechanics
function Player({
  highlights,
  onDeath,
  playerPosRef,
  playerDirRef,
  highlightStateRef,
  onHighlightUse,
  targetPosRef,
  speedBoostRef
}) {
  const meshRef = useRef()
  const stillTimeRef = useRef(0) // Track time standing still for Zeka

  const hasHighlight = (highlightId) => highlights.includes(highlightId)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()

      // Handle Zeka's Limit Break activation
      if (hasHighlight('zeka') && key === 'q' && highlightStateRef.current.zeka.primed) {
        onHighlightUse('zeka')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [highlights, onHighlightUse, highlightStateRef])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Calculate movement toward target position
    const targetX = targetPosRef.current.x
    const targetY = targetPosRef.current.y
    const currentX = meshRef.current.position.x
    const currentY = meshRef.current.position.y

    const dx = targetX - currentX
    const dy = targetY - currentY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Track standing still time for Zeka's Limit Break
    if (hasHighlight('zeka')) {
      if (distance < 0.05) {
        stillTimeRef.current += delta
        if (stillTimeRef.current >= 0.4 && !highlightStateRef.current.zeka.primed) {
          highlightStateRef.current.zeka.primed = true
        }
      } else {
        stillTimeRef.current = 0
      }
    }

    // Only move if we're not at the target position
    if (distance > 0.05) {
      // Normalize direction
      let moveX = dx / distance
      let moveY = dy / distance

      // Update player direction
      playerDirRef.current = { x: moveX, y: moveY }

      // Apply speed multiplier from speed boost ref (for various highlights)
      let speed = PLAYER_SPEED
      if (speedBoostRef.current.active) {
        speed *= speedBoostRef.current.multiplier
      }

      // Calculate movement amount
      const moveAmount = Math.min(speed * delta, distance)

      // Update position with bounds checking
      const newX = currentX + moveX * moveAmount
      const newY = currentY + moveY * moveAmount

      meshRef.current.position.x = THREE.MathUtils.clamp(newX, -MAP_SIZE, MAP_SIZE)
      meshRef.current.position.y = THREE.MathUtils.clamp(newY, -MAP_SIZE, MAP_SIZE)
    }

    // Update player position reference for collision detection
    playerPosRef.current = {
      x: meshRef.current.position.x,
      y: meshRef.current.position.y
    }
  })

  // Use primary highlight color or default
  const playerColor = highlights.length > 0 ? (
    highlights[0] === 'praygorilla' ? '#FF6B6B' :
    highlights[0] === 'ambition' ? '#FFD700' :
    highlights[0] === 'theshy' ? '#FFFFFF' :
    highlights[0] === 'zeka' ? '#4169E1' :
    highlights[0] === 'ruler' ? '#FFD700' : '#00C8C9'
  ) : '#00C8C9'

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0.1]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color={playerColor} transparent />
      </mesh>

      {/* Zeka primed indicator */}
      {hasHighlight('zeka') && highlightStateRef.current?.zeka?.primed && (
        <mesh position={[playerPosRef.current.x, playerPosRef.current.y, 0.11]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#4169E1" transparent opacity={0.8} />
        </mesh>
      )}
    </>
  )
}

// Main game component
function ReactionDash({ highlights, onGameOver, onScoreUpdate }) {
  const [telegraphs, setTelegraphs] = useState([])
  const nextTelegraphId = useRef(0)
  const lastSpawnTime = useRef(0)
  const startTime = useRef(null)
  const playerPosRef = useRef({ x: 0, y: 0 })
  const targetPosRef = useRef({ x: 0, y: 0 }) // Where player is moving to
  const playerDirRef = useRef({ x: 0, y: 1 }) // Default facing up
  const gameOver = useRef(false)
  const dodgeCount = useRef(0)
  const bgMeshRef = useRef()
  const speedBoostRef = useRef({ active: false, multiplier: 1, endsAt: 0 })
  const lastDodgeTime = useRef(0)

  // Load Summoner's Rift background texture
  const bgTexture = useTexture('/summoners-rift.jpg')

  // Highlight state management
  const highlightStateRef = useRef({
    praygorilla: { graceActive: false }, // Passive
    ambition: { firstDodgeUsed: false }, // Auto-trigger after 5s
    theshy: {}, // Passive - handled in collision
    zeka: { primed: false }, // Active ability
    ruler: {} // Passive - handled in collision
  })

  // Helper to check if a highlight is active
  const hasHighlight = (highlightId) => highlights.includes(highlightId)

  // Handle mouse clicks for movement
  const handleClick = (event) => {
    // event.point contains the 3D world coordinates of the click
    if (event.point) {
      targetPosRef.current = {
        x: THREE.MathUtils.clamp(event.point.x, -MAP_SIZE, MAP_SIZE),
        y: THREE.MathUtils.clamp(event.point.y, -MAP_SIZE, MAP_SIZE)
      }
    }
  }

  const handleHighlightUse = (highlightName) => {
    const currentTime = Date.now() / 1000

    // Zeka's Limit Break - burst dash
    if (highlightName === 'zeka' && highlightStateRef.current.zeka.primed) {
      speedBoostRef.current = { active: true, multiplier: 3, endsAt: currentTime + 0.3 }
      highlightStateRef.current.zeka.primed = false
    }
  }

  useFrame((state) => {
    if (gameOver.current) return

    const currentTime = state.clock.elapsedTime

    if (!startTime.current) {
      startTime.current = currentTime
    }

    const elapsed = currentTime - startTime.current

    // Update score
    if (onScoreUpdate) {
      onScoreUpdate(elapsed, dodgeCount.current)
    }

    // Update parallax background based on player position
    if (bgMeshRef.current && bgMeshRef.current.material.map) {
      const parallaxFactor = 0.02 // Subtle movement
      bgMeshRef.current.material.map.offset.x = playerPosRef.current.x * parallaxFactor
      bgMeshRef.current.material.map.offset.y = playerPosRef.current.y * parallaxFactor
    }

    // Update speed boost state
    const now = Date.now() / 1000
    if (speedBoostRef.current.active && now >= speedBoostRef.current.endsAt) {
      speedBoostRef.current = { active: false, multiplier: 1, endsAt: 0 }
    }

    // Spawn telegraphs aimed at player (1-3 at a time for chaos)
    if (currentTime - lastSpawnTime.current > TELEGRAPH_SPAWN_INTERVAL) {
      lastSpawnTime.current = currentTime

      // Spawn 1-3 telegraphs with staggered timing and varying sizes
      const numTelegraphs = Math.floor(Math.random() * MAX_SIMULTANEOUS_TELEGRAPHS) + 1
      const newTelegraphs = []

      for (let i = 0; i < numTelegraphs; i++) {
        // Aim telegraph at player's current position with some offset for difficulty
        const playerX = playerPosRef.current.x
        const playerY = playerPosRef.current.y

        // Add random offset so it's not always perfectly centered on player
        const offsetX = (Math.random() - 0.5) * 2
        const offsetY = (Math.random() - 0.5) * 2

        const telegraphX = playerX + offsetX
        const telegraphY = playerY + offsetY

        // Clamp to map bounds
        const clampedX = Math.max(-MAP_SIZE + 0.5, Math.min(MAP_SIZE - 0.5, telegraphX))
        const clampedY = Math.max(-MAP_SIZE + 0.5, Math.min(MAP_SIZE - 0.5, telegraphY))

        // Random radius between 0.35 and 0.65
        const telegraphRadius = 0.35 + Math.random() * 0.3

        // Stagger spawn times slightly (0 to 0.15 seconds delay)
        const spawnDelay = i * 0.05

        newTelegraphs.push({
          id: nextTelegraphId.current++,
          position: [clampedX, clampedY],
          spawnTime: currentTime + spawnDelay,
          radius: telegraphRadius
        })
      }

      setTelegraphs(prev => [...prev, ...newTelegraphs])
    }
  })

  const handleTelegraphExplode = (id, position, radius, spawnTime) => {
    // Remove telegraph
    setTelegraphs(prev => prev.filter(t => t.id !== id))
    dodgeCount.current += 1

    // Check collision with player
    const dx = playerPosRef.current.x - position[0]
    const dy = playerPosRef.current.y - position[1]
    const distance = Math.sqrt(dx * dx + dy * dy)

    const currentTime = Date.now() / 1000
    const elapsed = currentTime - (startTime.current || currentTime)

    // Check if player dodged
    const dodged = distance > radius

    if (dodged) {
      // Narrow dodge detection for Ruler's Last-Shot Instinct
      if (hasHighlight('ruler') && distance <= radius + 0.3 && distance > radius) {
        // Narrow dodge - give speed spike
        speedBoostRef.current = { active: true, multiplier: 1.8, endsAt: currentTime + 0.2 }
      }

      // Ambition's Path to Triumph - first dodge after 5s
      if (hasHighlight('ambition') && elapsed > 5 && !highlightStateRef.current.ambition.firstDodgeUsed) {
        speedBoostRef.current = { active: true, multiplier: 1.6, endsAt: currentTime + 0.3 }
        highlightStateRef.current.ambition.firstDodgeUsed = true
      }

      lastDodgeTime.current = currentTime
    } else {
      // Player was hit
      let isProtected = false

      // Pray & GorillA Miracle Hold - grace period on direct spawns
      if (hasHighlight('praygorilla')) {
        const timeSinceSpawn = currentTime - spawnTime
        if (timeSinceSpawn <= 0.15) {
          isProtected = true
        }
      }

      // TheShy Fearless Engage - recoil dash when touching edge
      if (hasHighlight('theshy') && distance <= radius && distance > radius - 0.2) {
        // Apply recoil dash away from telegraph
        const recoilX = playerPosRef.current.x - position[0]
        const recoilY = playerPosRef.current.y - position[1]
        const recoilLength = Math.sqrt(recoilX * recoilX + recoilY * recoilY)

        if (recoilLength > 0) {
          const normalizedX = recoilX / recoilLength
          const normalizedY = recoilY / recoilLength

          targetPosRef.current = {
            x: THREE.MathUtils.clamp(playerPosRef.current.x + normalizedX * 0.5, -MAP_SIZE, MAP_SIZE),
            y: THREE.MathUtils.clamp(playerPosRef.current.y + normalizedY * 0.5, -MAP_SIZE, MAP_SIZE)
          }
        }
        isProtected = true
      }

      // Player dies if not protected
      if (!isProtected) {
        gameOver.current = true
        onGameOver(dodgeCount.current)
      }
    }
  }

  // Set texture to cover entire area without repeating, maintaining aspect ratio
  if (bgTexture) {
    bgTexture.wrapS = THREE.ClampToEdgeWrapping
    bgTexture.wrapT = THREE.ClampToEdgeWrapping

    // Calculate scale to cover area while maintaining aspect ratio (like CSS object-fit: cover)
    const textureAspect = bgTexture.image.width / bgTexture.image.height
    const planeAspect = 1 // Our plane is square (MAP_SIZE * 2 / MAP_SIZE * 2)

    if (textureAspect > planeAspect) {
      // Texture is wider, scale by height
      const scale = textureAspect / planeAspect
      bgTexture.repeat.set(1 / scale, 1)
      bgTexture.offset.set((1 - 1 / scale) / 2, 0)
    } else {
      // Texture is taller, scale by width
      const scale = planeAspect / textureAspect
      bgTexture.repeat.set(1, 1 / scale)
      bgTexture.offset.set(0, (1 - 1 / scale) / 2)
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />

      {/* Map background - clickable for movement with parallax */}
      <mesh ref={bgMeshRef} position={[0, 0, -0.1]} onClick={handleClick}>
        <planeGeometry args={[MAP_SIZE * 2, MAP_SIZE * 2]} />
        <meshBasicMaterial map={bgTexture} />
      </mesh>

      {/* Map border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(MAP_SIZE * 2, MAP_SIZE * 2)]} />
        <lineBasicMaterial color="#1e3a5f" />
      </lineSegments>

      <Player
        highlights={highlights}
        playerPosRef={playerPosRef}
        targetPosRef={targetPosRef}
        playerDirRef={playerDirRef}
        highlightStateRef={highlightStateRef}
        onHighlightUse={handleHighlightUse}
        speedBoostRef={speedBoostRef}
        onDeath={() => {
          gameOver.current = true
          onGameOver(dodgeCount.current)
        }}
      />

      {telegraphs.map(telegraph => (
        <Telegraph
          key={telegraph.id}
          id={telegraph.id}
          position={telegraph.position}
          spawnTime={telegraph.spawnTime}
          radius={telegraph.radius}
          onExplode={(id, pos, rad) => handleTelegraphExplode(id, pos, rad, telegraph.spawnTime)}
        />
      ))}
    </>
  )
}

export default ReactionDash
