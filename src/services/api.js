/**
 * API Service Layer for Word Adventure
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class WordAdventureAPI {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('admin_token')
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API Error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      if (response.token) {
        this.token = response.token
        localStorage.setItem('admin_token', response.token)
      }
      
      return response
    } catch (error) {
      // Fallback to demo login if API is not available
      console.warn('API login failed, using demo mode:', error.message)
      return this.demoLogin(credentials)
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.warn('API logout failed:', error.message)
    } finally {
      this.token = null
      localStorage.removeItem('admin_token')
    }
  }

  // Demo login for offline/development mode
  demoLogin(credentials) {
    if (credentials.username && credentials.password) {
      const demoUser = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@wordadventure.com`,
        avatar: '👤',
        level: 1,
        points: 0,
        isDemo: true
      }
      return { success: true, user: demoUser }
    }
    return { success: false, error: 'Please enter username and password' }
  }

  // Word operations
  async getWords() {
    try {
      return await this.request('/words')
    } catch (error) {
      console.warn('Failed to fetch words from API, using local data')
      return null
    }
  }

  async createWord(word) {
    try {
      return await this.request('/words', {
        method: 'POST',
        body: JSON.stringify(word)
      })
    } catch (error) {
      console.warn('Failed to create word via API:', error.message)
      throw error
    }
  }

  async updateWord(id, updates) {
    try {
      return await this.request(`/words/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    } catch (error) {
      console.warn('Failed to update word via API:', error.message)
      throw error
    }
  }

  async deleteWord(id) {
    try {
      return await this.request(`/words/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.warn('Failed to delete word via API:', error.message)
      throw error
    }
  }

  // User progress operations
  async getUserProgress(userId) {
    try {
      return await this.request(`/users/${userId}/progress`)
    } catch (error) {
      console.warn('Failed to fetch user progress from API')
      return null
    }
  }

  async updateUserProgress(userId, progressData) {
    try {
      return await this.request(`/users/${userId}/progress`, {
        method: 'PUT',
        body: JSON.stringify(progressData)
      })
    } catch (error) {
      console.warn('Failed to update user progress via API:', error.message)
      // Continue with local storage fallback
      return null
    }
  }

  // Analytics operations
  async getAnalytics() {
    try {
      return await this.request('/analytics')
    } catch (error) {
      console.warn('Failed to fetch analytics from API')
      return null
    }
  }

  async trackEvent(eventData) {
    try {
      return await this.request('/analytics/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      })
    } catch (error) {
      console.warn('Failed to track event via API:', error.message)
      // Continue silently for analytics
      return null
    }
  }

  // Category operations
  async getCategories() {
    try {
      return await this.request('/categories')
    } catch (error) {
      console.warn('Failed to fetch categories from API, using local data')
      return null
    }
  }

  async createCategory(category) {
    try {
      return await this.request('/categories', {
        method: 'POST',
        body: JSON.stringify(category)
      })
    } catch (error) {
      console.warn('Failed to create category via API:', error.message)
      throw error
    }
  }

  // Bulk operations
  async bulkImportWords(csvData) {
    try {
      const formData = new FormData()
      formData.append('csv', csvData)
      
      return await this.request('/words/bulk-import', {
        method: 'POST',
        body: formData,
        headers: {
          ...(this.token && { 'Authorization': `Bearer ${this.token}` })
          // Don't set Content-Type for FormData
        }
      })
    } catch (error) {
      console.warn('Failed to bulk import words via API:', error.message)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health')
      return { status: 'online', ...response }
    } catch (error) {
      return { status: 'offline', error: error.message }
    }
  }
}

// Create singleton instance
const api = new WordAdventureAPI()

export default api

// Export individual methods for convenience
export const {
  login,
  logout,
  getWords,
  createWord,
  updateWord,
  deleteWord,
  getUserProgress,
  updateUserProgress,
  getAnalytics,
  trackEvent,
  getCategories,
  createCategory,
  bulkImportWords,
  healthCheck
} = api

