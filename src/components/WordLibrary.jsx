import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { useApp } from '../App'
import { 
  Search, 
  Volume2, 
  Filter, 
  BookOpen,
  Check,
  X,
  Star
} from 'lucide-react'

const WordLibrary = () => {
  const { words, updateWordStatus } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'known' && word.known) ||
      (selectedStatus === 'unknown' && !word.known)
    
    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const toggleWordStatus = (wordId, currentStatus) => {
    updateWordStatus(wordId, !currentStatus)
  }

  const difficultyColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    hard: 'from-red-400 to-red-500'
  }

  const difficulties = ['all', 'easy', 'medium', 'hard']
  const statuses = ['all', 'known', 'unknown']

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
          <BookOpen className="h-10 w-10 mr-3" />
          Word Library 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📚
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          Explore and practice all your words
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
            <Input
              type="text"
              placeholder="Search for words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <span className="text-purple-700 font-medium">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedDifficulty === difficulty 
                      ? 'bg-purple-500 text-white' 
                      : 'text-purple-600 border-purple-300'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-purple-700 font-medium">Status:</span>
              {statuses.map((status) => (
                <Button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedStatus === status 
                      ? 'bg-purple-500 text-white' 
                      : 'text-purple-600 border-purple-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-purple-600"
      >
        Showing {filteredWords.length} of {words.length} words
      </motion.div>

      {/* Words Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Card className="card-hover bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 text-center space-y-4">
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {word.known ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <X className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Word Image */}
                  <motion.div
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-md"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-4xl">{word.image}</div>
                  </motion.div>

                  {/* Word Text */}
                  <h3 className="text-xl font-bold text-gray-800">{word.word}</h3>

                  {/* Difficulty Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyColors[word.difficulty]} text-white`}>
                    {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => speakWord(word.word)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 p-0"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => toggleWordStatus(word.id, word.known)}
                      size="sm"
                      className={`rounded-full w-10 h-10 p-0 ${
                        word.known 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {word.known ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-purple-800 mb-2">No words found</h3>
          <p className="text-purple-600">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  )
}

export default WordLibrary

