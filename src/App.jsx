import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import WordLibrary from './components/WordLibrary'
import WordTesting from './components/WordTesting'
import Results from './components/Results'
import ProgressDashboard from './components/ProgressDashboard'
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

// Default categories
const defaultCategories = [
  { id: 'food', name: 'Food', emoji: '🍎', color: 'from-red-400 to-orange-400' },
  { id: 'animals', name: 'Animals', emoji: '🐱', color: 'from-green-400 to-blue-400' },
  { id: 'objects', name: 'Objects', emoji: '🏠', color: 'from-purple-400 to-pink-400' },
  { id: 'nature', name: 'Nature', emoji: '🌳', color: 'from-green-400 to-emerald-400' },
  { id: 'body', name: 'Body Parts', emoji: '👁️', color: 'from-yellow-400 to-red-400' },
  { id: 'colors', name: 'Colors', emoji: '🌈', color: 'from-pink-400 to-purple-400' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', color: 'from-blue-400 to-indigo-400' },
  { id: 'actions', name: 'Actions', emoji: '🏃', color: 'from-orange-400 to-red-400' }
]

// Sample words data for demo
const sampleWords = [
  { id: 1, word: 'Apple', image: '🍎', known: false, difficulty: 'easy', category: 'food' },
  { id: 2, word: 'Banana', image: '🍌', known: false, difficulty: 'easy', category: 'food' },
  { id: 3, word: 'Cat', image: '🐱', known: true, difficulty: 'easy', category: 'animals' },
  { id: 4, word: 'Dog', image: '🐶', known: true, difficulty: 'easy', category: 'animals' },
  { id: 5, word: 'Elephant', image: '🐘', known: false, difficulty: 'medium', category: 'animals' },
  { id: 6, word: 'Fish', image: '🐟', known: false, difficulty: 'easy', category: 'animals' },
  { id: 7, word: 'Giraffe', image: '🦒', known: false, difficulty: 'medium', category: 'animals' },
  { id: 8, word: 'House', image: '🏠', known: true, difficulty: 'easy', category: 'objects' },
  { id: 9, word: 'Ice cream', image: '🍦', known: true, difficulty: 'easy', category: 'food' },
  { id: 10, word: 'Jellyfish', image: '🪼', known: false, difficulty: 'hard', category: 'animals' }
]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState(sampleWords)
  const [categories, setCategories] = useState(defaultCategories)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [testResults, setTestResults] = useState([])
  const [isTestMode, setIsTestMode] = useState(false)
  const [selectedQuizCategories, setSelectedQuizCategories] = useState([])

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
    
    // Load saved test results
    const savedTestResults = localStorage.getItem('word_adventure_test_results')
    if (savedTestResults) {
      try {
        setTestResults(JSON.parse(savedTestResults))
      } catch (error) {
        console.error('Error parsing saved test results:', error)
      }
    }

    // Load saved categories
    const savedCategories = localStorage.getItem('word_adventure_categories')
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (error) {
        console.error('Error parsing saved categories:', error)
      }
    }
    
    setLoading(false)
  }, [])

  // Save words progress whenever it changes
  useEffect(() => {
    localStorage.setItem('word_adventure_words', JSON.stringify(words))
  }, [words])

  // Save test results whenever they change
  useEffect(() => {
    localStorage.setItem('word_adventure_test_results', JSON.stringify(testResults))
  }, [testResults])

  // Save categories whenever they change
  useEffect(() => {
    localStorage.setItem('word_adventure_categories', JSON.stringify(categories))
  }, [categories])

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

  const addCategory = (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: `custom_${Date.now()}`
    }
    setCategories(prev => [...prev, categoryWithId])
    return categoryWithId
  }

  const updateCategory = (categoryId, updatedCategory) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      )
    )
  }

  const deleteCategory = (categoryId) => {
    // Don't allow deleting default categories
    const isDefault = defaultCategories.some(cat => cat.id === categoryId)
    if (isDefault) return

    // Remove category from words first
    setWords(prev =>
      prev.map(word =>
        word.category === categoryId ? { ...word, category: 'objects' } : word
      )
    )

    // Remove category
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const getFilteredWordsForQuiz = () => {
    if (selectedQuizCategories.length === 0) {
      return words
    }
    return words.filter(word => selectedQuizCategories.includes(word.category))
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
    categories,
    setCategories,
    currentWordIndex,
    setCurrentWordIndex,
    testResults,
    setTestResults,
    isTestMode,
    setIsTestMode,
    selectedQuizCategories,
    setSelectedQuizCategories,
    updateWordStatus,
    addTestResult,
    resetTest,
    addCategory,
    updateCategory,
    deleteCategory,
    getFilteredWordsForQuiz
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
          <Route path="/progress" element={<ProgressDashboard />} />
          <Route path="/settings" element={<ParentSettings />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
