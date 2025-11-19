import React from 'react'
import styles from './ResultPanel.module.css'

function ResultPanel({ isCorrect, playerName, lore, onNext }) {
  return (
    <div className={styles.resultPanel}>
      <div className={`${styles.resultHeader} ${isCorrect ? styles.correct : styles.incorrect}`}>
        <div className={styles.resultIcon}>
          {isCorrect ? '✓' : '✗'}
        </div>
        <h2 className={styles.resultText}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>
      </div>
      
      <div className={styles.playerInfo}>
        <div className={styles.playerName}>{playerName}</div>
        <div className={styles.playerLore}>{lore}</div>
      </div>
      
      <button className={styles.nextButton} onClick={onNext}>
        Next Clip
      </button>
    </div>
  )
}

export default ResultPanel

