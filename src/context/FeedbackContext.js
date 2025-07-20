import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import apiService from '../services/apiService';

// Shared data key untuk semua platform
const SHARED_DATA_KEY = 'akb_feedbacks_shared';

// Platform-specific storage wrapper with sync capabilities
const storage = {
  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.log('Storage getItem error:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        // Also try to sync with a shared key for cross-platform access
        localStorage.setItem(SHARED_DATA_KEY, value);
        return true;
      } else {
        await AsyncStorage.setItem(key, value);
        // Try to set shared key for potential web access
        await AsyncStorage.setItem(SHARED_DATA_KEY, value);
        return true;
      }
    } catch (error) {
      console.log('Storage setItem error:', error);
      return false;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        localStorage.removeItem(SHARED_DATA_KEY);
        return true;
      } else {
        await AsyncStorage.removeItem(key);
        await AsyncStorage.removeItem(SHARED_DATA_KEY);
        return true;
      }
    } catch (error) {
      console.log('Storage removeItem error:', error);
      return false;
    }
  },

  // Sync function untuk mendapatkan data terbaru dari platform manapun
  async syncData() {
    try {
      console.log('Syncing data across platforms...');
      
      // Coba ambil data dari shared key
      const sharedData = await this.getItem(SHARED_DATA_KEY);
      const regularData = await this.getItem('feedbacks');
      
      // Gunakan data yang lebih baru atau yang ada
      let finalData = null;
      
      if (sharedData && regularData) {
        const sharedParsed = JSON.parse(sharedData);
        const regularParsed = JSON.parse(regularData);
        
        // Gunakan yang memiliki lebih banyak data atau timestamp terbaru
        if (sharedParsed.length >= regularParsed.length) {
          finalData = sharedData;
        } else {
          finalData = regularData;
        }
      } else if (sharedData) {
        finalData = sharedData;
      } else if (regularData) {
        finalData = regularData;
      }
      
      // Simpan data yang sudah disync ke kedua key
      if (finalData) {
        await this.setItem('feedbacks', finalData);
        console.log('Data synced successfully');
        return JSON.parse(finalData);
      }
      
      return [];
    } catch (error) {
      console.log('Error syncing data:', error);
      return [];
    }
  },
};

const FeedbackContext = createContext();

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    anonymous: 0,
    averageRating: 0,
    satisfactionRate: 0,
  });

  // Load saved feedbacks on app start with server sync
  useEffect(() => {
    loadFeedbacks();
    checkServerConnection();
    
    // Auto-sync setiap 30 detik untuk menjaga data tetap sinkron
    const syncInterval = setInterval(async () => {
      await syncDataFromServer();
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  // Update stats when feedbacks change
  useEffect(() => {
    updateStats();
    if (!isOnline) {
      saveFeedbacks(); // Save to local storage only if offline
    }
  }, [feedbacks]);

  const checkServerConnection = async () => {
    try {
      const available = await apiService.isServerAvailable();
      setIsOnline(available);
      console.log(`🌐 Server ${available ? 'ONLINE' : 'OFFLINE'} - Platform: ${Platform.OS}`);
      
      if (available) {
        // Try to sync local data to server
        await syncLocalDataToServer();
      }
    } catch (error) {
      console.log('Error checking server connection:', error);
      setIsOnline(false);
    }
  };

  const syncLocalDataToServer = async () => {
    try {
      const localData = await storage.getItem('feedbacks');
      if (localData) {
        const localFeedbacks = JSON.parse(localData);
        if (localFeedbacks.length > 0) {
          console.log(`📤 Syncing ${localFeedbacks.length} local feedbacks to server...`);
          await apiService.syncLocalDataToServer(localFeedbacks);
          // Clear local storage after successful sync
          await storage.removeItem('feedbacks');
        }
      }
    } catch (error) {
      console.log('Error syncing local data to server:', error);
    }
  };

  const loadFeedbacks = async () => {
    try {
      console.log('Loading feedbacks for platform:', Platform.OS);
      
      // Try to get data from server first
      const serverData = await apiService.getFeedbacks();
      if (serverData && Array.isArray(serverData)) {
        console.log('✅ Loaded from server:', serverData.length, 'items');
        setFeedbacks(serverData);
        setIsOnline(true);
        return;
      }

      // Fallback to local storage
      console.log('📱 Fallback to local storage');
      setIsOnline(false);
      const saved = await storage.getItem('feedbacks');
      if (saved) {
        const parsedFeedbacks = JSON.parse(saved);
        console.log('Loaded from local storage:', parsedFeedbacks.length, 'items');
        setFeedbacks(parsedFeedbacks);
      }
    } catch (error) {
      console.log('Error loading feedbacks:', error);
      setIsOnline(false);
    }
  };

  const syncDataFromServer = async () => {
    try {
      if (!isOnline) return;
      
      const serverData = await apiService.getFeedbacks();
      if (serverData && serverData.length !== feedbacks.length) {
        console.log('🔄 Server data changed, updating from', feedbacks.length, 'to', serverData.length);
        setFeedbacks(serverData);
      }
    } catch (error) {
      console.log('Error syncing from server:', error);
      setIsOnline(false);
    }
  };

  const saveFeedbacks = async () => {
    try {
      console.log(
        'Saving feedbacks for platform:',
        Platform.OS,
        'count:',
        feedbacks.length
      );
      const success = await storage.setItem(
        'feedbacks',
        JSON.stringify(feedbacks)
      );
      console.log('Save result:', success ? 'success' : 'failed');
    } catch (error) {
      console.log('Error saving feedbacks:', error);
    }
  };

  const analyzeSentiment = (text) => {
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'fantastic',
      'love',
      'perfect',
      'awesome',
      'brilliant',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'horrible',
      'hate',
      'worst',
      'poor',
      'disappointing',
      'frustrating',
      'annoying',
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerText.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerText.includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateWordCloud = () => {
    const allText = feedbacks.map((f) => f.message).join(' ');
    const words = allText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            // English stop words
            'this',
            'that',
            'with',
            'have',
            'will',
            'been',
            'from',
            'they',
            'know',
            'want',
            'been',
            'good',
            'just',
            'like',
            'time',
            'very',
            'when',
            'come',
            'here',
            'how',
            'also',
            'its',
            'our',
            'out',
            'many',
            'some',
            'what',
            'would',
            'make',
            'only',
            'think',
            'see',
            'him',
            'two',
            'more',
            'go',
            'no',
            'way',
            'could',
            'my',
            'than',
            'first',
            'been',
            'call',
            'who',
            'oil',
            'sit',
            'now',
            'find',
            'long',
            'down',
            'day',
            'did',
            'get',
            'has',
            'her',
            'his',
            'how',
            'man',
            'new',
            'now',
            'old',
            'see',
            'two',
            'way',
            'who',
            'boy',
            'did',
            'its',
            'let',
            'put',
            'say',
            'she',
            'too',
            'use',
            // Indonesian stop words
            'yang',
            'dan',
            'ini',
            'itu',
            'untuk',
            'dari',
            'dengan',
            'pada',
            'akan',
            'atau',
            'dalam',
            'adalah',
            'tidak',
            'ada',
            'sudah',
            'masih',
            'juga',
            'dapat',
            'bisa',
            'harus',
            'saya',
            'anda',
            'kita',
            'mereka',
            'dia',
          ].includes(word)
      );

    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ text: word, value: count }));
  };

  const updateStats = () => {
    const total = feedbacks.length;
    const positive = feedbacks.filter((f) => f.sentiment === 'positive').length;
    const negative = feedbacks.filter((f) => f.sentiment === 'negative').length;
    const neutral = feedbacks.filter((f) => f.sentiment === 'neutral').length;
    const anonymous = feedbacks.filter((f) => f.isAnonymous).length;

    const averageRating =
      total > 0
        ? feedbacks.reduce((sum, f) => {
            const rating = Number(f.rating) || 0;
            return sum + rating;
          }, 0) / total
        : 0;

    // Calculate satisfaction rate (rating 4+ stars)
    const satisfiedCount = feedbacks.filter(
      (f) => Number(f.rating) >= 4
    ).length;
    const satisfactionRate =
      total > 0 ? Math.round((satisfiedCount / total) * 100) : 0;

    setStats({
      total,
      positive,
      negative,
      neutral,
      anonymous,
      averageRating: Math.round(averageRating * 10) / 10,
      satisfactionRate,
    });
  };

  const submitFeedback = async (feedbackData) => {
    try {
      console.log('Submitting feedback...', feedbackData);
      
      const newFeedback = {
        id: Date.now().toString(),
        ...feedbackData,
        message: feedbackData.text,
        rating: Number(feedbackData.rating) || 0,
        isAnonymous: isAnonymous,
        sentiment: analyzeSentiment(feedbackData.text),
        timestamp: new Date().toISOString(),
      };

      // Try to submit to server first
      if (isOnline) {
        try {
          const serverFeedback = await apiService.addFeedback(newFeedback);
          console.log('✅ Feedback submitted to server');
          
          // Refresh data from server to get all feedbacks
          await syncDataFromServer();
          return true;
        } catch (error) {
          console.log('Failed to submit to server, saving locally');
          setIsOnline(false);
        }
      }

      // Fallback: save locally
      console.log('💾 Saving feedback locally');
      setFeedbacks((prev) => [...prev, newFeedback]);
      return true;
    } catch (error) {
      console.log('Error submitting feedback:', error);
      return false;
    }
  };

  const clearAllFeedbacks = async () => {
    try {
      console.log('Clearing all feedbacks for platform:', Platform.OS);
      
      // Try to clear from server first
      if (isOnline) {
        try {
          const success = await apiService.clearAllFeedbacks();
          if (success) {
            console.log('✅ Cleared all feedbacks from server');
            setFeedbacks([]);
            return true;
          }
        } catch (error) {
          console.log('Failed to clear from server, clearing locally');
        }
      }

      // Fallback: clear locally
      setFeedbacks([]);
      await storage.removeItem('feedbacks');
      console.log('💾 Cleared local feedbacks');
      
      return true;
    } catch (error) {
      console.log('Error clearing feedbacks:', error);
      return false;
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      console.log('Deleting feedback:', feedbackId);
      
      // Try to delete from server first
      if (isOnline) {
        try {
          const success = await apiService.deleteFeedback(feedbackId);
          if (success) {
            console.log('✅ Deleted feedback from server');
            // Refresh data from server
            await syncDataFromServer();
            return true;
          }
        } catch (error) {
          console.log('Failed to delete from server, deleting locally');
        }
      }

      // Fallback: delete locally
      setFeedbacks((prev) => prev.filter(f => f.id !== feedbackId));
      console.log('💾 Deleted feedback locally');
      
      return true;
    } catch (error) {
      console.log('Error deleting feedback:', error);
      return false;
    }
  };

  const value = {
    feedbacks,
    stats,
    isConnected,
    isAnonymous,
    isOnline,
    setIsAnonymous,
    submitFeedback,
    clearAllFeedbacks,
    deleteFeedback,
    generateWordCloud,
    syncDataFromServer,
    checkServerConnection,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
