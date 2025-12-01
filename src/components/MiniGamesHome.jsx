import React from 'react'
import { Link } from 'react-router-dom'
import './MiniGamesHome.css'

function MiniGamesHome() {
  const games = [
    {
      id: 1,
      title: 'Shooting Range',
      description: 'Test your aim and reflexes, compared to Esports players',
      image: '/game1.png',
      players: '1.3K',
      route: '/game'
    },
    {
      id: 2,
      title: "Climbing Summoner's Rift",
      description: 'Jump as high as you can. Avoid the blasts.',
      image: '/game2.png',
      players: '40K',
      route: '/guess-player'
    },
    {
      id: 3,
      title: 'Dash',
      description: 'Dodge enemy range indicators and survive',
      image: '/game3.png',
      players: '2.5K',
      route: '/reaction-dash'
    }
  ]

  return (
    <div className="minigames-container">
      {/* Live Match Banner */}
      <div className="live-match-banner">
        <div className="match-content">
          <div className="play-button-wrapper">
            <div className="play-text">WATCH NOW</div>
          </div>

          <div className="teams-container">
            <span className="team-name">GEN</span>
            <img src="/Highlight_Team_Boxes/Gen_g.png" alt="Gen.G" className="team-logo-small" />

            <div className="match-score-hidden">
              <span className="hidden-icon">3 / 1</span>
            </div>

            <img src="/Highlight_Team_Boxes/DRX.png" alt="DRX" className="team-logo-small" />
            <span className="team-name">DRX</span>
          </div>
        </div>

        <div className="match-footer">
          <div className="league-icon">
            <img src="/riot.png" alt="Worlds" />
          </div>
          <span className="match-info">Worlds • Quarterfinals</span>
          <span className="match-format">Bo5</span>
        </div>
      </div>

      {/* main section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-subtitle">WORLDS 2025</div>
          <h1 className="hero-title">MINI GAMES</h1>
          <p className="hero-description">
            Test your skill / Climb up the Leaderboards
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
                  <img src={game.image} alt={game.title} className="game-bg-image" />
                  <div className="game-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
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
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                      <span>{game.players}</span>
                    </div>
                    <Link to={game.route || "/game"} className="play-button">
                      Play
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
                <h3>Shooting Range</h3>
                <Link to="/leaderboard" className="view-all">View All →</Link>
              </div>
              <div className="leaderboard-list">
                {[
                  { rank: 1, name: 'Faker', score: '505' },
                  { rank: 2, name: 'ILiketomato', score: '503' },
                  { rank: 3, name: 'T1onTop', score: '498' },
                  { rank: 4, name: 'RiotM', score: '497' },
                  { rank: 5, name: 'You', score: '497' }
                ].map(player => (
                  <div key={player.rank} className="leaderboard-item">
                    <div className="player-rank">{player.rank}</div>
                    <div className="player-name">{player.name}</div>
                    <div className="player-score">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="leaderboard-card">
              <div className="leaderboard-header">
                <h3>Climbing Summoner's Rift</h3>
                <Link to="/leaderboard" className="view-all">View All →</Link>
              </div>
              <div className="leaderboard-list">
                {[
                  { rank: 1, name: 'Faker', score: '998' },
                  { rank: 2, name: 'Chovy', score: '950' },
                  { rank: 3, name: 'Caps', score: '925' },
                  { rank: 4, name: 'ShowMaker', score: '890' },
                  { rank: 5, name: 'Knight', score: '850' }
                ].map(player => (
                  <div key={player.rank} className="leaderboard-item">
                    <div className="player-rank">{player.rank}</div>
                    <div className="player-name">{player.name}</div>
                    <div className="player-score">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="leaderboard-card">
              <div className="leaderboard-header">
                <h3>Dash</h3>
                <Link to="/leaderboard" className="view-all">View All →</Link>
              </div>
              <div className="leaderboard-list">
                {[
                  { rank: 1, name: 'Keria', score: '350' },
                  { rank: 2, name: 'Gumayusi', score: '342' },
                  { rank: 3, name: 'Ruler', score: '335' },
                  { rank: 4, name: 'Viper', score: '320' },
                  { rank: 5, name: 'Deft', score: '310' }
                ].map(player => (
                  <div key={player.rank} className="leaderboard-item">
                    <div className="player-rank">{player.rank}</div>
                    <div className="player-name">{player.name}</div>
                    <div className="player-score">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default MiniGamesHome;