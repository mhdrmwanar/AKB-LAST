import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Platform-specific storage wrapper
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
        return true;
      } else {
        await AsyncStorage.setItem(key, value);
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
        return true;
      } else {
        await AsyncStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.log('Storage removeItem error:', error);
      return false;
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
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    anonymous: 0,
    averageRating: 0,
    satisfactionRate: 0,
    todayCount: 0,
  });

  // Load saved feedbacks on app start
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Update stats when feedbacks change
  useEffect(() => {
    updateStats();
    saveFeedbacks();
  }, [feedbacks]);

  const loadFeedbacks = async () => {
    try {
      console.log('Loading feedbacks for platform:', Platform.OS);
      const saved = await storage.getItem('feedbacks');
      console.log('Loaded data:', saved ? 'found' : 'not found');
      if (saved) {
        const parsedFeedbacks = JSON.parse(saved);
        console.log('Parsed feedbacks count:', parsedFeedbacks.length);
        setFeedbacks(parsedFeedbacks);
      }
    } catch (error) {
      console.log('Error loading feedbacks:', error);
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

    // Calculate today's feedback count
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayCount = feedbacks.filter((f) => {
      const feedbackDate = new Date(f.timestamp);
      return feedbackDate >= todayStart;
    }).length;

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
      todayCount,
    });
  };

  const submitFeedback = (feedbackData) => {
    try {
      const newFeedback = {
        id: Date.now().toString(),
        ...feedbackData,
        message: feedbackData.text,
        rating: Number(feedbackData.rating) || 0, // Ensure rating is a number
        isAnonymous: isAnonymous,
        sentiment: analyzeSentiment(feedbackData.text),
        timestamp: new Date().toISOString(),
      };

      setFeedbacks((prev) => [...prev, newFeedback]);
      return true; // Return success
    } catch (error) {
      console.log('Error submitting feedback:', error);
      return false;
    }
  };

  const clearAllFeedbacks = async () => {
    try {
      console.log('Clearing all feedbacks for platform:', Platform.OS);
      setFeedbacks([]);
      const success = await storage.removeItem('feedbacks');
      console.log('Clear storage result:', success ? 'success' : 'failed');

      // Reset stats when clearing
      setStats({
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        anonymous: 0,
        averageRating: 0,
        satisfactionRate: 0,
        todayCount: 0,
      });
      return true;
    } catch (error) {
      console.log('Error clearing feedbacks:', error);
      return false;
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      console.log('deleteFeedback called with ID:', feedbackId);
      console.log(
        'Current feedbacks before delete:',
        feedbacks.map((f) => ({ id: f.id, text: f.text?.substring(0, 20) }))
      );

      const originalLength = feedbacks.length;

      setFeedbacks((prev) => {
        const filtered = prev.filter((feedback) => {
          const shouldKeep = feedback.id !== feedbackId;
          console.log(
            `Feedback ${feedback.id}: ${shouldKeep ? 'keeping' : 'DELETING'}`
          );
          return shouldKeep;
        });
        console.log(
          `Filter result: ${filtered.length} items (was ${originalLength})`
        );

        // Force a re-render by creating new array
        return [...filtered];
      });

      // Also update storage immediately for web compatibility
      setTimeout(async () => {
        try {
          const updatedFeedbacks = feedbacks.filter((f) => f.id !== feedbackId);
          const success = await storage.setItem(
            'feedbacks',
            JSON.stringify(updatedFeedbacks)
          );
          console.log(
            'Storage updated after delete:',
            success ? 'success' : 'failed'
          );
        } catch (error) {
          console.log('Error updating storage:', error);
        }
      }, 100);

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
    setIsAnonymous,
    submitFeedback,
    clearAllFeedbacks,
    deleteFeedback,
    generateWordCloud,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
