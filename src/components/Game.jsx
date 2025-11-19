import React, { useState, useEffect, useRef } from 'react'
import Target from './Target'

// target positions - change daily
const TARGET_POSITIONS = [
  [-2.4, 1.3, 0],
  [1.8, -0.9, 0],
  [-0.5, 1.7, 0],
  [2.7, 0.4, 0],
  [-1.2, -1.5, 0],
  [0.9, 1.1, 0],
  [-2.9, -0.3, 0],
  [2.1, -1.8, 0],
  [0.3, -0.6, 0],
  [-1.7, 0.8, 0],
  [2.5, 1.6, 0],
  [-0.8, -1.2, 0],
  [1.4, 0.2, 0],
  [-2.2, 1.9, 0],
  [0.6, -1.4, 0],
  [2.9, -0.5, 0],
  [-1.5, 1.4, 0],
  [1.1, -1.7, 0],
  [-0.2, 0.9, 0],
  [2.3, 1.2, 0],
  [-2.6, -1.1, 0],
  [0.8, 1.8, 0],
  [1.9, -0.2, 0],
  [-1.0, -0.7, 0],
  [2.4, 0.6, 0],
  [-1.8, 1.6, 0],
  [0.4, -1.9, 0],
  [2.8, -1.3, 0],
  [-0.7, 0.5, 0],
  [1.6, 1.5, 0]
]

function Game({ onTargetHit, onTargetExpired }) {
  const [targets, setTargets] = useState([])
  const nextIdRef = useRef(0)
  const positionIndexRef = useRef(0)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  const getNextPosition = () => {
    const position = TARGET_POSITIONS[positionIndexRef.current % TARGET_POSITIONS.length]
    positionIndexRef.current = (positionIndexRef.current + 1) % TARGET_POSITIONS.length
    return position
  }

  const spawnTarget = () => {
    if (!mountedRef.current) return

    const id = nextIdRef.current
    const newTarget = {
      id,
      position: getNextPosition(),
      spawnTime: Date.now()
    }
    setTargets(prevTargets => [...prevTargets, newTarget])
    nextIdRef.current += 1
  }

  useEffect(() => {
    mountedRef.current = true

    // Spawn first few targets immediately
    spawnTarget()
    setTimeout(() => spawnTarget(), 200)
    setTimeout(() => spawnTarget(), 400)

    // Keep spawning new targets continuously
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        spawnTarget()
      }
    }, 600) // Spawn every 600ms

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleTargetHit = (targetId, points) => {
    setTargets(prev => prev.filter(t => t.id !== targetId))
    onTargetHit(points)
  }

  const handleTargetExpired = (targetId) => {
    setTargets(prev => prev.filter(t => t.id !== targetId))
    onTargetExpired()
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {targets.map(target => (
        <Target
          key={target.id}
          position={target.position}
          spawnTime={target.spawnTime}
          onHit={(points) => handleTargetHit(target.id, points)}
          onExpired={() => handleTargetExpired(target.id)}
        />
      ))}
    </>
  )
}

export default Game
