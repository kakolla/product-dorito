import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import ReactionDash from './ReactionDash'
import './ReactionDashPage.css'

function ReactionDashPage() {
  const [selectedHighlights, setSelectedHighlights] = useState([])
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
    setSelectedHighlights(prev => {
      // Toggle selection
      if (prev.includes(highlightId)) {
        return prev.filter(id => id !== highlightId)
      }
      // Max 3 selections
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, highlightId]
    })
  }

  const handleStartGame = () => {
    if (selectedHighlights.length === 0) return
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
    setSelectedHighlights([])
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
        {!gameStarted && !gameOver && (
          <div className="champion-select-overlay">
            <h1 className="select-title">Select 3 Worlds Highlights</h1>
            <p className="select-subtitle">{selectedHighlights.length}/3 Selected</p>
            <div className="champions-grid">
              {highlights.map(highlight => (
                <div
                  key={highlight.id}
                  className={`champion-card ${selectedHighlights.includes(highlight.id) ? 'selected' : ''} ${selectedHighlights.length >= 3 && !selectedHighlights.includes(highlight.id) ? 'disabled' : ''}`}
                  onClick={() => handleHighlightSelect(highlight.id)}
                >
                  <div className="champion-name">{highlight.name}</div>
                  <div className="champion-ability">
                    <div className="ability-name">{highlight.team} {highlight.year}</div>
                    <div className="ability-key">Type: {highlight.type}</div>
                    <div className="ability-desc">{highlight.description}</div>
                  </div>
                  {selectedHighlights.includes(highlight.id) && (
                    <div className="selection-badge">{selectedHighlights.indexOf(highlight.id) + 1}</div>
                  )}
                </div>
              ))}
            </div>
            {selectedHighlights.length > 0 && (
              <button className="start-button" onClick={handleStartGame}>
                Start Game
              </button>
            )}
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
              <div className="abilities-hud-container">
                {selectedHighlights.map(highlightId => {
                  const highlight = highlights.find(h => h.id === highlightId)
                  return (
                    <div key={highlightId} className="ability-hud">
                      <div className="ability-name">{highlight?.name}</div>
                      <div className="ability-key-hint">{highlight?.type}</div>
                    </div>
                  )
                })}
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
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{Math.floor(score.time * 10 + score.dodges * 5)}</div>
                </div>
                <div className="final-stat">
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{score.time.toFixed(1)}s</div>
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
          {gameStarted && !gameOver && selectedHighlights.length > 0 && (
            <ReactionDash
              highlights={selectedHighlights}
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
