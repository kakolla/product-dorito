import React from 'react'
import { Link } from 'react-router-dom'
import GameController from '../components/GuessPlayer/GameController'
import styles from './GuessPlayerPage.module.css'

function GuessPlayerPage() {
  return (
    <div className={styles.guessPlayerPage}>
      <div className={styles.gameHeader}>
        <Link to="/mini-games" className={styles.backButton}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Mini Games
        </Link>
      </div>
      
      <div className={styles.gameContainer}>
        <div className={styles.gameTitle}>
          <h1>Guess the Esports Player</h1>
          <p>Who Pulled It Off?</p>
        </div>
        
        <GameController />
      </div>
    </div>
  )
}

export default GuessPlayerPage

