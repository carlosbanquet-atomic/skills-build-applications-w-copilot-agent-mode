import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import octofitLogo from '../../../docs/octofitapp-small.png'
import './App.css'

const navigation = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/users" aria-label="Octofit Tracker home">
          <img src={octofitLogo} alt="" />
          <span>Octofit Tracker</span>
        </NavLink>
        <nav className="navbar-nav flex-row flex-wrap gap-2" aria-label="Main navigation">
          {navigation.map(({ label, path }) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2${isActive ? ' active' : ''}`
              }
              key={path}
              to={path}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container-fluid app-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/users" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate replace to="/users" />} />
        </Routes>
      </main>
      <footer className="app-footer">Move together. Get stronger together.</footer>
    </div>
  )
}

export default App
