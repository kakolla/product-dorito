import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Game from './components/Game'
import UI from './components/UI'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(10)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const canvasRef = useRef()

  // main functions
  const startGame = () => {
    setScore(0)
    setLives(10)
    setGameOver(false)
    setGameStarted(true)
  }

  const handleTargetHit = (points) => {
    setScore(prev => prev + points)
  }

  const handleMiss = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameOver(true)
        setGameStarted(false)
      }
      return newLives
    })
  }

  const handleTargetExpired = () => {
    handleMiss()
  }

  return (
    <div className="app">
      <UI
        score={score}
        lives={lives}
        gameOver={gameOver}
        gameStarted={gameStarted}
        onStart={startGame}
      />
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: false }}
        onPointerMissed={gameStarted && !gameOver ? handleMiss : undefined}
      >
        <color attach="background" args={['#0f1923']} />
        {gameStarted && !gameOver && (
          <Game
            onTargetHit={handleTargetHit}
            onTargetExpired={handleTargetExpired}
          />
        )}
      </Canvas>
    </div>
  )
}

export default App
