import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import WordLibrary from './components/WordLibrary'
import WordTesting from './components/WordTesting'
import Results from './components/Results'
import ParentSettings from './components/ParentSettings'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// Authentication Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// App Context for global state
const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Sample words data for demo
const sampleWords = [
  { id: 1, word: 'Apple', image: '🍎', known: false, difficulty: 'easy' },
  { id: 2, word: 'Banana', image: '🍌', known: false, difficulty: 'easy' },
  { id: 3, word: 'Cat', image: '🐱', known: true, difficulty: 'easy' },
  { id: 4, word: 'Dog', image: '🐶', known: true, difficulty: 'easy' },
  { id: 5, word: 'Elephant', image: '🐘', known: false, difficulty: 'medium' },
  { id: 6, word: 'Fish', image: '🐟', known: false, difficulty: 'easy' },
  { id: 7, word: 'Giraffe', image: '🦒', known: false, difficulty: 'medium' },
  { id: 8, word: 'House', image: '🏠', known: true, difficulty: 'easy' },
  { id: 9, word: 'Ice cream', image: '🍦', known: true, difficulty: 'easy' },
  { id: 10, word: 'Jellyfish', image: '🪼', known: false, difficulty: 'hard' }
]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState(sampleWords)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [testResults, setTestResults] = useState([])
  const [isTestMode, setIsTestMode] = useState(false)

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('word_adventure_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('word_adventure_user')
      }
    }
    
    // Load saved words progress
    const savedWords = localStorage.getItem('word_adventure_words')
    if (savedWords) {
      try {
        setWords(JSON.parse(savedWords))
      } catch (error) {
        console.error('Error parsing saved words:', error)
      }
    }
    
    setLoading(false)
  }, [])

  // Save words progress whenever it changes
  useEffect(() => {
    localStorage.setItem('word_adventure_words', JSON.stringify(words))
  }, [words])

  const login = async (username, password) => {
    // Demo login - in real app this would call an API
    if (username && password) {
      const demoUser = {
        id: 1,
        username: username,
        email: `${username}@wordadventure.com`,
        avatar: '👤',
        level: 1,
        points: 0
      }
      setUser(demoUser)
      localStorage.setItem('word_adventure_user', JSON.stringify(demoUser))
      return { success: true }
    }
    return { success: false, error: 'Please enter username and password' }
  }

  const logout = () => {
    localStorage.removeItem('word_adventure_user')
    setUser(null)
    setTestResults([])
    setCurrentWordIndex(0)
    setIsTestMode(false)
  }

  const updateWordStatus = (wordId, known) => {
    setWords(prevWords => 
      prevWords.map(word => 
        word.id === wordId ? { ...word, known } : word
      )
    )
  }

  const addTestResult = (wordId, remembered) => {
    setTestResults(prev => [...prev, { wordId, remembered, timestamp: Date.now() }])
  }

  const resetTest = () => {
    setTestResults([])
    setCurrentWordIndex(0)
    setIsTestMode(false)
  }

  const authValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  }

  const appValue = {
    words,
    setWords,
    currentWordIndex,
    setCurrentWordIndex,
    testResults,
    setTestResults,
    isTestMode,
    setIsTestMode,
    updateWordStatus,
    addTestResult,
    resetTest
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={authValue}>
      <AppContext.Provider value={appValue}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/login" 
                  element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
                />
                <Route 
                  path="/*" 
                  element={user ? <AuthenticatedApp /> : <Navigate to="/login" replace />} 
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AppContext.Provider>
    </AuthContext.Provider>
  )
}

function AuthenticatedApp() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<WordLibrary />} />
          <Route path="/test" element={<WordTesting />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<ParentSettings />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App

