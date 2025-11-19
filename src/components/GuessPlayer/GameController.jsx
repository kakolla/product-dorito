import React, { useState, useEffect } from 'react'
import HighlightCard from './HighlightCard'
import GuessOptions from './GuessOptions'
import ResultPanel from './ResultPanel'
import ScoreScreen from './ScoreScreen'
import esportsClips from '../../data/esportsClips.json'

function GameController() {
  const [clips, setClips] = useState(() => {
    // Shuffle clips for variety
    return [...esportsClips].sort(() => Math.random() - 0.5)
  })
  const [currentClipIndex, setCurrentClipIndex] = useState(0)
  const [selectedGuess, setSelectedGuess] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const currentClip = clips[currentClipIndex]
  const isLastClip = currentClipIndex === clips.length - 1

  const handleGuess = (guess) => {
    setSelectedGuess(guess)
  }

  const handleSubmit = () => {
    if (!selectedGuess) return
    
    const isCorrect = selectedGuess === currentClip.correctPlayer
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLastClip) {
      setGameOver(true)
    } else {
      setCurrentClipIndex(prev => prev + 1)
      setSelectedGuess(null)
      setShowResult(false)
    }
  }

  const handlePlayAgain = () => {
    // Reshuffle clips
    const shuffled = [...esportsClips].sort(() => Math.random() - 0.5)
    setClips(shuffled)
    
    // Reset game state
    setCurrentClipIndex(0)
    setSelectedGuess(null)
    setShowResult(false)
    setScore(0)
    setGameOver(false)
  }

  // Auto-submit when a guess is selected (optional - you can change this to require a submit button)
  useEffect(() => {
    if (selectedGuess && !showResult) {
      const timer = setTimeout(() => {
        handleSubmit()
      }, 500) // Small delay for UX
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGuess, showResult])

  if (gameOver) {
    return <ScoreScreen score={score} totalClips={clips.length} onPlayAgain={handlePlayAgain} />
  }

  return (
    <div>
      <HighlightCard
        clipNumber={currentClipIndex + 1}
        totalClips={clips.length}
        videoUrl={currentClip.videoUrl}
      />
      
      {!showResult ? (
        <GuessOptions
          choices={currentClip.choices}
          selectedGuess={selectedGuess}
          onSelect={handleGuess}
          disabled={showResult}
        />
      ) : (
        <ResultPanel
          isCorrect={selectedGuess === currentClip.correctPlayer}
          playerName={currentClip.correctPlayer}
          lore={currentClip.lore}
          onNext={handleNext}
        />
      )}
    </div>
  )
}

export default GameController

