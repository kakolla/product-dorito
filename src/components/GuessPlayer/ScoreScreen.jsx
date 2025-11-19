import React from 'react'
import styles from './ScoreScreen.module.css'

function ScoreScreen({ score, totalClips, onPlayAgain }) {
  const percentage = Math.round((score / totalClips) * 100)
  
  return (
    <div className={styles.scoreScreen}>
      <div className={styles.scoreContent}>
        <h2 className={styles.scoreTitle}>Game Over!</h2>
        
        <div className={styles.scoreStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Score</div>
            <div className={styles.statValue}>{score} / {totalClips}</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Accuracy</div>
            <div className={styles.statValue}>{percentage}%</div>
          </div>
        </div>
        
        <div className={styles.scoreMessage}>
          {percentage === 100 && (
            <div className={styles.perfectScore}>Perfect! You're an esports expert! 🏆</div>
          )}
          {percentage >= 80 && percentage < 100 && (
            <div className={styles.greatScore}>Great job! You know your esports! 🎯</div>
          )}
          {percentage >= 60 && percentage < 80 && (
            <div className={styles.goodScore}>Not bad! Keep practicing! 💪</div>
          )}
          {percentage < 60 && (
            <div className={styles.okScore}>Keep watching those highlights! 📺</div>
          )}
        </div>
        
        <button className={styles.playAgainButton} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default ScoreScreen

