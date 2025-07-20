import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const saved = await AsyncStorage.getItem('feedbacks');
      if (saved) {
        setFeedbacks(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading feedbacks:', error);
    }
  };

  const saveFeedbacks = async () => {
    try {
      await AsyncStorage.setItem('feedbacks', JSON.stringify(feedbacks));
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
          ].includes(word)
      );

    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  };

  const updateStats = () => {
    const total = feedbacks.length;
    const positive = feedbacks.filter((f) => f.sentiment === 'positive').length;
    const negative = feedbacks.filter((f) => f.sentiment === 'negative').length;
    const neutral = feedbacks.filter((f) => f.sentiment === 'neutral').length;
    const anonymous = feedbacks.filter((f) => f.isAnonymous).length;
    const averageRating =
      total > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;

    setStats({
      total,
      positive,
      negative,
      neutral,
      anonymous,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  };

  const submitFeedback = (feedbackData) => {
    try {
      const newFeedback = {
        id: Date.now().toString(),
        ...feedbackData,
        message: feedbackData.text,
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
    setFeedbacks([]);
    try {
      await AsyncStorage.removeItem('feedbacks');
      // Reset stats when clearing
      setStats({
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        anonymous: 0,
        averageRating: 0,
      });
    } catch (error) {
      console.log('Error clearing feedbacks:', error);
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
    generateWordCloud,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
