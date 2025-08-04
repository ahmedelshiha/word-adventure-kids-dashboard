import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { useAuth, useApp } from '../App'
import { 
  Settings, 
  User, 
  Volume2, 
  Palette, 
  Shield, 
  Download,
  Upload,
  RotateCcw,
  Save
} from 'lucide-react'

const ParentSettings = () => {
  const { user } = useAuth()
  const { words, setWords, resetTest } = useApp()
  
  const [settings, setSettings] = useState({
    soundEnabled: true,
    autoAdvance: false,
    showDifficulty: true,
    darkMode: false,
    childName: user?.username || '',
    dailyGoal: 5
  })

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    localStorage.setItem('word_adventure_settings', JSON.stringify(settings))
    // Show success message
    alert('Settings saved successfully! 🎉')
  }

  const resetProgress = () => {
    if (showResetConfirm) {
      // Reset all word progress
      const resetWords = words.map(word => ({ ...word, known: false }))
      setWords(resetWords)
      resetTest()
      localStorage.removeItem('word_adventure_words')
      setShowResetConfirm(false)
      alert('Progress reset successfully! 🔄')
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000)
    }
  }

  const exportProgress = () => {
    const data = {
      words,
      settings,
      exportDate: new Date().toISOString(),
      user: user?.username
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `word-adventure-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importProgress = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.words) {
            setWords(data.words)
            alert('Progress imported successfully! 📥')
          }
          if (data.settings) {
            setSettings(data.settings)
          }
        } catch (error) {
          alert('Error importing file. Please check the file format. ❌')
        }
      }
      reader.readAsText(file)
    }
  }

  const settingSections = [
    {
      title: 'Profile Settings',
      icon: User,
      items: [
        {
          key: 'childName',
          label: 'Child Name',
          type: 'input',
          value: settings.childName,
          placeholder: 'Enter child name'
        },
        {
          key: 'dailyGoal',
          label: 'Daily Learning Goal',
          type: 'number',
          value: settings.dailyGoal,
          min: 1,
          max: 20
        }
      ]
    },
    {
      title: 'Learning Preferences',
      icon: Settings,
      items: [
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          type: 'switch',
          value: settings.soundEnabled,
          description: 'Enable word pronunciation and sound effects'
        },
        {
          key: 'autoAdvance',
          label: 'Auto Advance',
          type: 'switch',
          value: settings.autoAdvance,
          description: 'Automatically move to next word after answering'
        },
        {
          key: 'showDifficulty',
          label: 'Show Difficulty',
          type: 'switch',
          value: settings.showDifficulty,
          description: 'Display difficulty level for each word'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          type: 'switch',
          value: settings.darkMode,
          description: 'Use dark theme (coming soon)'
        }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-2 text-fun-shadow flex items-center justify-center">
          <Settings className="h-10 w-10 mr-3" />
          Settings 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚙️
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          Customize your Word Adventure experience
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 flex items-center">
                  <section.icon className="h-6 w-6 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {item.label}
                        </label>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                      
                      {item.type === 'switch' && (
                        <Switch
                          checked={item.value}
                          onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                        />
                      )}
                      
                      {item.type === 'input' && (
                        <Input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-40"
                        />
                      )}
                      
                      {item.type === 'number' && (
                        <Input
                          type="number"
                          value={item.value}
                          onChange={(e) => handleSettingChange(item.key, parseInt(e.target.value))}
                          min={item.min}
                          max={item.max}
                          className="w-20"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={exportProgress}
                className="btn-fun bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Progress
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importProgress}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  className="w-full btn-fun bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Import Progress
                </Button>
              </div>
              
              <Button
                onClick={resetProgress}
                variant={showResetConfirm ? "destructive" : "outline"}
                className={`btn-fun ${
                  showResetConfirm 
                    ? 'bg-red-500 text-white' 
                    : 'border-2 border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {showResetConfirm ? 'Confirm Reset' : 'Reset Progress'}
              </Button>
            </div>
            
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-red-700 text-sm">
                  ⚠️ This will reset all learning progress. Click "Confirm Reset" again to proceed.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Button
          onClick={saveSettings}
          className="btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </Button>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Safety
        </h3>
        <div className="text-sm text-purple-700 space-y-1">
          <p>🔒 All data is stored locally on your device</p>
          <p>🚫 No personal information is shared online</p>
          <p>👨‍👩‍👧‍👦 Designed with child safety in mind</p>
          <p>📱 Works offline after initial load</p>
        </div>
      </motion.div>
    </div>
  )
}

export default ParentSettings

