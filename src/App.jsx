import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import MiniGamesHome from './components/MiniGamesHome'
import GamePage from './components/GamePage'
import GuessPlayerPage from './pages/GuessPlayerPage'
import ReactionDashPage from './components/ReactionDashPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/mini-games" replace />} />
          <Route path="/mini-games" element={<MiniGamesHome />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/guess-player" element={<GuessPlayerPage />} />
          <Route path="/reaction-dash" element={<ReactionDashPage />} />
          <Route path="/events" element={<MiniGamesHome />} />
          <Route path="/power-rankings" element={<MiniGamesHome />} />
          <Route path="/pick-ems" element={<MiniGamesHome />} />
          <Route path="/rewards" element={<MiniGamesHome />} />
          <Route path="/news" element={<MiniGamesHome />} />
          <Route path="/leaderboard" element={<MiniGamesHome />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
