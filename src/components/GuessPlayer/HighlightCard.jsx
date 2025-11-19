import React from 'react'
import styles from './HighlightCard.module.css'

function HighlightCard({ clipNumber, totalClips, videoUrl }) {
  return (
    <div className={styles.highlightCard}>
      <div className={styles.clipCounter}>
        Clip {clipNumber} of {totalClips}
      </div>
      <div className={styles.videoContainer}>
        {videoUrl === 'placeholder' ? (
          <div className={styles.placeholder}>
            <div className={styles.placeholderText}>VIDEO PLACEHOLDER</div>
            <div className={styles.placeholderSubtext}>
              Real highlight clip will appear here
            </div>
          </div>
        ) : (
          <video
            className={styles.video}
            src={videoUrl}
            controls
            playsInline
          />
        )}
      </div>
    </div>
  )
}

export default HighlightCard

