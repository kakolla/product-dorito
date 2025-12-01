import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import ReactionDash from './ReactionDash'
import './ReactionDashPage.css'

function ReactionDashPage() {
  const [selectedHighlight, setSelectedHighlight] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState({ time: 0, dodges: 0 })
  const [currentTime, setCurrentTime] = useState(0)
  const [currentDodges, setCurrentDodges] = useState(0)

  const highlights = [
    {
      id: 'praygorilla',
      name: 'Miracle Hold',
      team: 'ROX Tigers',
      year: '2016',
      description: '0.15s grace period on direct spawns',
      type: 'Passive'
    },
    {
      id: 'ambition',
      name: "Path to Triumph",
      team: 'Samsung Galaxy',
      year: '2017',
      description: 'First dodge after 5s: 0.3s speed burst',
      type: 'Auto-Trigger'
    },
    {
      id: 'theshy',
      name: 'Fearless Engage',
      team: 'Invictus Gaming',
      year: '2018',
      description: 'Telegraph edge touch: recoil dash',
      type: 'Passive'
    },
    {
      id: 'zeka',
      name: 'Limit Break',
      team: 'DRX',
      year: '2022',
      description: 'Stand still 0.4s to prime burst (Q)',
      type: 'Active'
    },
    {
      id: 'ruler',
      name: 'Last-Shot Instinct',
      team: 'Gen.G',
      year: '2023',
      description: 'Narrow dodge: 0.2s speed spike',
      type: 'Passive'
    }
  ]

  const handleHighlightSelect = (highlightId) => {
    setSelectedHighlight(highlightId)
  }

  const handleStartGame = () => {
    if (!selectedHighlight) return
    setGameStarted(true)
    setGameOver(false)
    setScore({ time: 0, dodges: 0 })
    setCurrentTime(0)
    setCurrentDodges(0)
  }

  const handleGameOver = (dodges) => {
    setGameOver(true)
    setGameStarted(false)
    setScore({ time: currentTime, dodges })
  }

  const handleScoreUpdate = (time, dodges) => {
    setCurrentTime(time)
    setCurrentDodges(dodges)
  }

  const handleBackToSelect = () => {
    setSelectedHighlight(null)
    setGameStarted(false)
    setGameOver(false)
  }

  return (
    <div className="reaction-dash-page">
      <div className="game-header">
        <Link to="/mini-games" className="back-button">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Mini Games
        </Link>
      </div>

      <div className="game-container">
        {/* Highlight Select Screen */}
        {!selectedHighlight && !gameStarted && !gameOver && (
          <div className="champion-select-overlay">
            <h1 className="select-title">Select Your Worlds Highlight</h1>
            <div className="champions-grid">
              {highlights.map(highlight => (
                <div
                  key={highlight.id}
                  className="champion-card"
                  onClick={() => handleHighlightSelect(highlight.id)}
                >
                  <div className="champion-name">{highlight.name}</div>
                  <div className="champion-ability">
                    <div className="ability-name">{highlight.team} {highlight.year}</div>
                    <div className="ability-key">Type: {highlight.type}</div>
                    <div className="ability-desc">{highlight.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-game screen (highlight selected but not started) */}
        {selectedHighlight && !gameStarted && !gameOver && (
          <div className="pre-game-overlay">
            <div className="selected-champion-info">
              <h2>{highlights.find(h => h.id === selectedHighlight)?.name}</h2>
              <p className="controls-info">{highlights.find(h => h.id === selectedHighlight)?.team} - Worlds {highlights.find(h => h.id === selectedHighlight)?.year}</p>
              <p className="controls-info">Controls: Click to move</p>
              <p className="controls-info">
                {highlights.find(h => h.id === selectedHighlight)?.description}
              </p>
            </div>
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
            <button className="back-select-button" onClick={handleBackToSelect}>
              Change Highlight
            </button>
          </div>
        )}

        {/* HUD - During Gameplay */}
        {gameStarted && !gameOver && (
          <div className="hud-overlay">
            <div className="hud-top">
              <div className="hud-stat">
                <div className="hud-label">TIME</div>
                <div className="hud-value">{currentTime.toFixed(1)}s</div>
              </div>
              <div className="hud-stat">
                <div className="hud-label">DODGES</div>
                <div className="hud-value">{currentDodges}</div>
              </div>
            </div>
            <div className="hud-bottom">
              <div className="ability-hud">
                <div className="ability-name">
                  {highlights.find(h => h.id === selectedHighlight)?.name}
                </div>
                <div className="ability-key-hint">
                  {highlights.find(h => h.id === selectedHighlight)?.type}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h1 className="game-over-title">Game Over</h1>
              <div className="final-stats">
                <div className="final-stat">
                  <div className="stat-label">Survived</div>
                  <div className="stat-value">{score.time.toFixed(2)}s</div>
                </div>
                <div className="final-stat">
                  <div className="stat-label">Dodges</div>
                  <div className="stat-value">{score.dodges}</div>
                </div>
              </div>
              <button className="start-button" onClick={handleStartGame}>
                Play Again
              </button>
              <button className="back-select-button" onClick={handleBackToSelect}>
                Change Highlight
              </button>
            </div>
          </div>
        )}

        {/* Canvas */}
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ alpha: false }}
        >
          <color attach="background" args={['#0a1428']} />
          {gameStarted && !gameOver && selectedHighlight && (
            <ReactionDash
              highlight={selectedHighlight}
              onGameOver={handleGameOver}
              onScoreUpdate={handleScoreUpdate}
            />
          )}
        </Canvas>
      </div>
    </div>
  )
}

export default ReactionDashPage
