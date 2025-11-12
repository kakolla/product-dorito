import React, { useState, useEffect, useRef } from 'react'
import Target from './Target'

function Game({ onTargetHit, onTargetExpired }) {
  const [targets, setTargets] = useState([])
  const [nextId, setNextId] = useState(0)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  const getRandomPosition = () => {
    // Generate random position within viewport bounds
    // Keep targets away from edges
    const x = (Math.random() - 0.5) * 6 // -3 to 3
    const y = (Math.random() - 0.5) * 4 // -2 to 2
    return [x, y, 0]
  }

  const spawnTarget = () => {
    if (!mountedRef.current) return

    setNextId(prev => {
      const id = prev
      const newTarget = {
        id,
        position: getRandomPosition(),
        spawnTime: Date.now()
      }
      setTargets(prevTargets => [...prevTargets, newTarget])
      return prev + 1
    })
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
