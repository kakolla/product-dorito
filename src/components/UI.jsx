import React from 'react'
import './UI.css'

function UI({ score, gameOver, gameStarted, onStart, targetsDestroyed }) {
  return (
    <div className="ui-overlay">
      {/* HUD - Only show during gameplay */}
      {gameStarted && !gameOver && (
        <div className="hud">
          <div className="score-display">
            <div className="label">SCORE</div>
            <div className="value">{score}</div>
          </div>
          <div className="targets-display">
            <div className="label">TARGETS</div>
            <div className="value">{targetsDestroyed}/6</div>
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
