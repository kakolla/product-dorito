import React from 'react'
import './UI.css'

function UI({ score, gameOver, gameStarted, onStart, targetsDestroyed }) {
  return (
    <div className="ui-overlay">
      {/* HUD - Hidden during gameplay, only shows on game over */}

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
