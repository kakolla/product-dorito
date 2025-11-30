import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import Game from './Game'
import UI from './UI'
import './GamePage.css'

// Component to handle click events inside the Canvas
function ClickHandler({ onCanvasClick, enabled }) {
  const handleClick = () => {
    if (!enabled) return
    onCanvasClick()
  }

  return (
    <mesh
      position={[0, 0, -10]}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

function GamePage() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(10)
  const [targetsDestroyed, setTargetsDestroyed] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const canvasRef = useRef()

  const startGame = () => {
    setScore(0)
    setLives(10)
    setTargetsDestroyed(0)
    setGameOver(false)
    setGameStarted(true)
  }

  const handleTargetHit = (points) => {
    setScore(prev => prev + points)
    setTargetsDestroyed(prev => prev + 1)
  }

  const handleTargetExpired = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameOver(true)
        setGameStarted(false)
      }
      return newLives
    })
  }

  const handleGameComplete = () => {
    // Game completed - all 10 targets done
    setGameOver(true)
    setGameStarted(false)
  }

  const handleCanvasClick = () => {
    // Shoot projectile in the current aim direction
    if (window.__gameShootProjectile) {
      window.__gameShootProjectile()
    }
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/mini-games" className="back-button">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Mini Games
        </Link>
      </div>
      <div className="game-container">
        <UI
          score={score}
          lives={lives}
          targetsDestroyed={targetsDestroyed}
          gameOver={gameOver}
          gameStarted={gameStarted}
          onStart={startGame}
        />
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ alpha: false }}
        >
          <color attach="background" args={['#0f1923']} />
          {gameStarted && !gameOver && (
            <>
              <Game
                onTargetHit={handleTargetHit}
                onTargetExpired={handleTargetExpired}
                onGameComplete={handleGameComplete}
              />
              <ClickHandler
                onCanvasClick={handleCanvasClick}
                enabled={gameStarted && !gameOver}
              />
            </>
          )}
        </Canvas>
      </div>
    </div>
  )
}

export default GamePage
