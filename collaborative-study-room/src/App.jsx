import { useEffect, useMemo, useState } from 'react'
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import ChatPage from './pages/Chat'
import WhiteboardPage from './pages/Whiteboard'
import FlashcardsPage from './pages/Flashcards'
import QuizPage from './pages/Quiz'
import CalendarPage from './pages/Calendar'
import PomodoroPage from './pages/Pomodoro'
import AdminPage from './pages/Admin'
import RecordingsPage from './pages/Recordings'
import Login from './pages/Login'
import Signup from './pages/Signup'

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('theme') === 'dark'
  })
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])
  return { isDark, toggle: () => setIsDark((v) => !v) }
}

function useA11yControls() {
  const [fontSize, setFontSize] = useState(1)
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}rem`)
  }, [fontSize])
  return { fontSize, setFontSize }
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
}

function Layout({ children }) {
  const { isDark, toggle } = useTheme()
  const { fontSize, setFontSize } = useA11yControls()
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('csr_user')||'null') } catch { return null }
  })
  const logout = () => { setUser(null); localStorage.removeItem('csr_user'); navigate('/login') }

  const navLinkClass = ({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow"></span>
            <span className="font-semibold tracking-tight">Collaborative Study Room</span>
          </NavLink>
          <nav className="hidden md:flex gap-1">
            <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
            <NavLink to="/whiteboard" className={navLinkClass}>Whiteboard</NavLink>
            <NavLink to="/flashcards" className={navLinkClass}>Flashcards</NavLink>
            <NavLink to="/quiz" className={navLinkClass}>Quiz</NavLink>
            <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
            <NavLink to="/pomodoro" className={navLinkClass}>Pomodoro</NavLink>
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            <NavLink to="/recordings" className={navLinkClass}>Recordings</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle dark mode" title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1">
              <label className="sr-only" htmlFor="font-size">Font size</label>
              <input id="font-size" type="range" min="0.875" max="1.25" step="0.025" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24" />
            </div>
            {!user ? (
              <div className="flex items-center gap-2">
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <NavLink to="/signup" className="px-3 py-2 rounded-md bg-indigo-600 text-white">Sign Up</NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">Hi, {user.name}</span>
                <button onClick={logout} className="nav-link">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">Built for students • Demo UI</div>
      </footer>
    </div>
  )
}

function PageContainer({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {children}
    </motion.div>
  )
}

// Placeholder components; real implementations added in respective files
function Home() {
  return (
    <PageContainer>
      <div className="grid xl:grid-cols-3 gap-4">
        {/* Welcome + Tips */}
        <div className="xl:col-span-2 space-y-4">
          <div className="glass p-5">
            <h2 className="text-lg font-semibold mb-1">Welcome</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Choose a tool from the navigation to start collaborating.</p>
          </div>

          {/* Quick actions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NavLink to="/chat" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Chat</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Discuss with your group in real time.</p>
            </NavLink>
            <NavLink to="/whiteboard" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Whiteboard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Sketch diagrams and solutions together.</p>
            </NavLink>
            <NavLink to="/flashcards" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Flashcards</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Flip through key concepts.</p>
            </NavLink>
            <NavLink to="/quiz" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Quiz</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Test your knowledge with MCQs.</p>
            </NavLink>
            <NavLink to="/calendar" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Calendar</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Plan upcoming study sessions.</p>
            </NavLink>
            <NavLink to="/pomodoro" className="glass p-4 hover:shadow-xl transition-shadow rounded-2xl">
              <h3 className="font-semibold">Pomodoro</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Stay focused with intervals.</p>
            </NavLink>
          </div>

          {/* Recent activity */}
          <div className="glass p-5">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>• You created a quiz in Algebra</li>
              <li>• Mia added 5 flashcards to Biology</li>
              <li>• Session scheduled for Friday 4:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Achievements + Mini-widgets */}
        <div className="space-y-4">
          <div className="glass p-5">
            <h2 className="text-lg font-semibold mb-2">Streaks & Achievements</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 text-sm">🔥 7-day streak</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 text-sm">✅ Focus Master</span>
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="font-semibold">Next Session</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Fri • 4:00 PM • Algebra Ch. 6</p>
            <NavLink to="/calendar" className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Open Calendar</NavLink>
          </div>

          <div className="glass p-5">
            <h3 className="font-semibold">Quick Focus</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Start a 25:00 Pomodoro</p>
            <NavLink to="/pomodoro" className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Start Now</NavLink>
          </div>
      </div>
      </div>
    </PageContainer>
  )
}

// Pages will be imported from ./pages later; for now, placeholders
const Placeholder = (title) => () => (
  <PageContainer>
    <div className="glass rounded-2xl p-6 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-slate-600 dark:text-slate-300 mt-2">UI coming up next...</p>
    </div>
  </PageContainer>
)

// Real pages imported above

export default function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={(u)=>{ localStorage.setItem('csr_user', JSON.stringify(u)); window.location.href='/' }} />} />
          <Route path="/signup" element={<Signup onSignup={(u)=>{ localStorage.setItem('csr_user', JSON.stringify(u)); window.location.href='/' }} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/whiteboard" element={<WhiteboardPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
