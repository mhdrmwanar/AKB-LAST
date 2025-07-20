import { Platform } from 'react-native';

// Server configuration
const SERVER_CONFIG = {
  // PENTING: Ganti IP address di bawah dengan IP komputer Anda!
  // Cara cek IP: Buka Command Prompt, ketik: ipconfig
  // Cari "Wireless LAN adapter Wi-Fi" atau "Ethernet adapter"
  // Contoh IP: 192.168.1.100, 192.168.0.100, 10.0.0.100
  baseURL: Platform.OS === 'web' 
    ? 'http://localhost:3001' 
    : 'http://192.168.1.100:3001', // 👈 GANTI DENGAN IP KOMPUTER ANDA
};

class ApiService {
  constructor() {
    this.baseURL = SERVER_CONFIG.baseURL;
    console.log(`🔗 API Service initialized for ${Platform.OS}:`, this.baseURL);
  }

  // Helper method untuk network requests
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${data.success ? 'Success' : 'Error'}`);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      throw error;
    }
  }

  // Get all feedbacks
  async getFeedbacks() {
    try {
      const response = await this.request('/feedbacks');
      return response.data || [];
    } catch (error) {
      console.log('Failed to fetch feedbacks, using local storage fallback');
      return null; // Will trigger fallback to local storage
    }
  }

  // Add new feedback
  async addFeedback(feedbackData) {
    try {
      const response = await this.request('/feedbacks', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      });
      return response.data;
    } catch (error) {
      console.log('Failed to add feedback to server, will sync later');
      throw error;
    }
  }

  // Delete feedback
  async deleteFeedback(feedbackId) {
    try {
      const response = await this.request(`/feedbacks/${feedbackId}`, {
        method: 'DELETE',
      });
      return response.success;
    } catch (error) {
      console.log('Failed to delete feedback from server');
      throw error;
    }
  }

  // Clear all feedbacks
  async clearAllFeedbacks() {
    try {
      const response = await this.request('/feedbacks', {
        method: 'DELETE',
      });
      return response.success;
    } catch (error) {
      console.log('Failed to clear feedbacks from server');
      throw error;
    }
  }

  // Get statistics
  async getStats() {
    try {
      const response = await this.request('/stats');
      return response.data;
    } catch (error) {
      console.log('Failed to get stats from server');
      return null;
    }
  }

  // Sync local data to server (for offline-to-online sync)
  async syncLocalDataToServer(localFeedbacks) {
    try {
      console.log(`🔄 Syncing ${localFeedbacks.length} local feedbacks to server...`);
      
      for (const feedback of localFeedbacks) {
        try {
          await this.addFeedback(feedback);
        } catch (error) {
          console.log(`Failed to sync feedback ${feedback.id}:`, error.message);
        }
      }
      
      console.log('✅ Local data sync completed');
      return true;
    } catch (error) {
      console.error('❌ Failed to sync local data:', error);
      return false;
    }
  }

  // Check if server is available
  async isServerAvailable() {
    try {
      const response = await fetch(this.baseURL, { 
        method: 'GET',
        timeout: 5000 
      });
      return response.ok;
    } catch (error) {
      console.log('Server not available:', error.message);
      return false;
    }
  }
}

export default new ApiService();
