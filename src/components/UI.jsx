import React from 'react'
import './UI.css'

function UI({ score, lives, gameOver, gameStarted, onStart }) {
  return (
    <div className="ui-overlay">
      {/* HUD - Only show during gameplay */}
      {gameStarted && !gameOver && (
        <div className="hud">
          <div className="score-display">
            <div className="label">SCORE</div>
            <div className="value">{score}</div>
          </div>
          <div className="lives-display">
            <div className="label">LIVES</div>
            <div className="lives-container">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`life-dot ${i < lives ? 'active' : 'lost'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!gameStarted && !gameOver && (
        <div className="menu-screen">
          {/* <h1 className="title"></h1> */}
          <button className="start-button" onClick={onStart}>
            Hop in
          </button>
          <div className="instructions">
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="menu-screen">
          <div className="final-score">
            <div className="label">Score</div>
            <div className="value">{score}</div>
          </div>
          <button className="start-button" onClick={onStart}>
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  )
}

export default UI
