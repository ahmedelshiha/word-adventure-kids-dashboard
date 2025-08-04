import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useApp } from '../App'
import { 
  Volume2, 
  Check, 
  X, 
  Brain,
  ArrowRight,
  RotateCcw,
  Home
} from 'lucide-react'

const WordTesting = () => {
  const navigate = useNavigate()
  const { 
    words, 
    currentWordIndex, 
    setCurrentWordIndex, 
    testResults, 
    addTestResult, 
    resetTest,
    setIsTestMode 
  } = useApp()
  
  const [currentWord, setCurrentWord] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [lastAnswer, setLastAnswer] = useState(null)
  const [testStarted, setTestStarted] = useState(false)

  useEffect(() => {
    setIsTestMode(true)
    if (words.length > 0 && currentWordIndex < words.length) {
      setCurrentWord(words[currentWordIndex])
    }
    
    return () => {
      setIsTestMode(false)
    }
  }, [words, currentWordIndex, setIsTestMode])

  const progress = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0

  const speakWord = () => {
    if ('speechSynthesis' in window && currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswer = (remembered) => {
    if (!currentWord) return

    addTestResult(currentWord.id, remembered)
    setLastAnswer(remembered)
    setShowResult(true)

    // Auto advance after showing result
    setTimeout(() => {
      setShowResult(false)
      setLastAnswer(null)
      
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        // Test completed
        navigate('/results')
      }
    }, 1500)
  }

  const startTest = () => {
    resetTest()
    setCurrentWordIndex(0)
    setTestStarted(true)
  }

  const restartTest = () => {
    resetTest()
    setCurrentWordIndex(0)
    setShowResult(false)
    setLastAnswer(null)
  }

  const goHome = () => {
    navigate('/')
  }

  if (!testStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                className="text-8xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧠
              </motion.div>
              <CardTitle className="text-3xl font-bold text-purple-800">
                Quiz Time!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-purple-600">
                  Ready to test your word knowledge?
                </p>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-700">
                    📝 You'll see {words.length} words<br/>
                    🎯 Mark if you remember each one<br/>
                    🏆 Get your results at the end
                  </p>
                </div>
              </div>
              
              <Button
                onClick={startTest}
                className="w-full h-12 text-lg font-semibold btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
              
              <Button
                onClick={goHome}
                variant="outline"
                className="w-full btn-fun border-2 border-purple-300 text-purple-700"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Quiz Complete!</h2>
          <Button onClick={() => navigate('/results')} className="btn-fun">
            View Results
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-2 text-fun-shadow flex items-center justify-center">
          <Brain className="h-10 w-10 mr-3" />
          Quiz Time 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          Word {currentWordIndex + 1} of {words.length}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
      >
        <div className="flex justify-between text-sm text-purple-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </motion.div>

      {/* Word Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-8 text-center space-y-8">
            {/* Word Image */}
            <motion.div
              className="w-64 h-64 mx-auto bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl flex items-center justify-center shadow-lg"
              key={currentWord.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="text-9xl">{currentWord.image}</div>
            </motion.div>

            {/* Word Text */}
            <motion.h2 
              className="text-6xl font-bold text-gray-800 text-fun-shadow"
              key={`word-${currentWord.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentWord.word}
            </motion.h2>

            {/* Difficulty Badge */}
            <motion.div 
              className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentWord.difficulty.charAt(0).toUpperCase() + currentWord.difficulty.slice(1)} Level
            </motion.div>

            {/* Sound Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={speakWord}
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full w-20 h-20 shadow-lg pulse-glow"
              >
                <Volume2 className="w-10 h-10" />
              </Button>
            </motion.div>

            {/* Answer Buttons */}
            <AnimatePresence>
              {!showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-6 justify-center"
                >
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl px-8 py-6 text-xl font-semibold shadow-lg btn-fun"
                  >
                    <Check className="w-8 h-8 mr-3" />
                    I Remember! ✅
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl px-8 py-6 text-xl font-semibold shadow-lg btn-fun"
                  >
                    <X className="w-8 h-8 mr-3" />
                    I Forgot ❌
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`p-6 rounded-2xl ${
                    lastAnswer ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {lastAnswer ? '🎉' : '💪'}
                  </div>
                  <p className={`text-xl font-semibold ${
                    lastAnswer ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {lastAnswer ? 'Great job!' : 'Keep practicing!'}
                  </p>
                  <div className="flex items-center justify-center mt-2 text-purple-600">
                    <ArrowRight className="h-5 w-5 mr-1" />
                    <span>Moving to next word...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={restartTest}
          variant="outline"
          className="btn-fun border-2 border-purple-300 text-purple-700"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Restart Quiz
        </Button>
        
        <Button
          onClick={goHome}
          variant="outline"
          className="btn-fun border-2 border-purple-300 text-purple-700"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}

export default WordTesting

