import React from 'react'
import { Link } from 'react-router-dom'
import './MiniGamesHome.css'

function MiniGamesHome() {
  const games = [
    {
      id: 1,
      title: 'Reflex Aim Shot',
      description: 'Test your aim and reflexes, compared to Esports players',
      image: '/game1.jpg',
      players: '1.3K',
      route: '/game'
    },
    {
      id: 2,
      title: 'Guess the Esports Player',
      description: 'Who Pulled It Off?',
      image: '/game2.jpg',
      players: '40K',
      route: '/guess-player'
    },
    {
      id: 3,
      title: 'Range indicator Dash',
      description: 'Dodge enemy range indicators and survive',
      image: '/game3.jpg',
      players: '2.5K',
      route: '/reaction-dash'
    }
  ]

  return (
    <div className="mini-games-home">
      {/* main section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-subtitle">WORLDS 2025</div>
          <h1 className="hero-title">MINI GAMES</h1>
          <p className="hero-description">
            Climb up the Leaderboards / Earn Rewards
          </p>
        </div>
        <div className="hero-gradient"></div>
      </section>

      {/* games section */}
      <section className="games-section">
        <div className="games-container">
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-card-image">
                  <div className="game-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                  {game.status === 'LIVE' && (
                    <div className="game-status live">
                      <span className="status-dot"></span>
                      LIVE
                    </div>
                  )}
                  {game.status === 'SOON' && (
                    <div className="game-status soon">
                      COMING SOON
                    </div>
                  )}
                </div>
                <div className="game-card-content">
                  <h3 className="game-card-title">{game.title}</h3>
                  <p className="game-card-description">{game.description}</p>
                  <div className="game-card-footer">
                    <div className="game-players">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      <span>{game.players}</span>
                    </div>
                      <Link to={game.route || "/game"} className="play-button">
                        PLAY NOW
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* leaderboard section  */}
      <section className="leaderboard-section">
        <div className="section-container">
          <h2 className="section-title">TOP PLAYERS</h2>
          <div className="leaderboard-grid">
            <div className="leaderboard-card">
              <div className="leaderboard-header">
                <h3>Dorito MVP</h3>
                <Link to="/leaderboard" className="view-all">View All →</Link>
              </div>
              <div className="leaderboard-list">
                {[
                  { rank: 1, name: 'Player1', score: '15,420' },
                  { rank: 2, name: 'Player2', score: '14,880' },
                  { rank: 3, name: 'Player3', score: '13,950' },
                  { rank: 4, name: 'Player4', score: '12,670' },
                  { rank: 5, name: 'Player5', score: '11,920' }
                ].map(player => (
                  <div key={player.rank} className="leaderboard-item">
                    <div className="player-rank">{player.rank}</div>
                    <div className="player-name">{player.name}</div>
                    <div className="player-score">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="leaderboard-card coming-soon">
              <div className="leaderboard-header">
                <h3>Coming Soon</h3>
              </div>
              <div className="coming-soon-content">
                <p>coming soon</p>
              </div>
            </div>

            <div className="leaderboard-card coming-soon">
              <div className="leaderboard-header">
                <h3>Coming Soon</h3>
              </div>
              <div className="coming-soon-content">
                <p>coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* rewards area */}
      <section className="rewards-section">
        <div className="section-container">
          <h2 className="section-title">EARN REWARDS</h2>
          <div className="rewards-content">
            <p className="rewards-description">
              Compete in mini games to earn exclusive rewards and climb the leaderboards.
              Prove you're the best and claim your place among the champions!
            </p>
            <Link to="/rewards" className="rewards-button">
              VIEW REWARDS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MiniGamesHome;