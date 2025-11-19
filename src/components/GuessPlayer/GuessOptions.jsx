import React from 'react'
import styles from './GuessOptions.module.css'

function GuessOptions({ choices, selectedGuess, onSelect, disabled }) {
  return (
    <div className={styles.guessOptions}>
      <h3 className={styles.prompt}>Who pulled it off?</h3>
      <div className={styles.optionsGrid}>
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              selectedGuess === choice ? styles.selected : ''
            }`}
            onClick={() => !disabled && onSelect(choice)}
            disabled={disabled}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GuessOptions

