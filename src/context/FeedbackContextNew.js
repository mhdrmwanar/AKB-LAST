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
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    averageRating: 0,
  });

  // Load data from storage
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Update stats when feedbacks change
  useEffect(() => {
    calculateStats();
    saveFeedbacks();
  }, [feedbacks]);

  const loadFeedbacks = async () => {
    try {
      const stored = await AsyncStorage.getItem('feedbacks');
      if (stored) {
        setFeedbacks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  const saveFeedbacks = async () => {
    try {
      await AsyncStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    } catch (error) {
      console.error('Error saving feedbacks:', error);
    }
  };

  const calculateStats = () => {
    if (feedbacks.length === 0) {
      setStats({
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        averageRating: 0,
      });
      return;
    }

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let totalRating = 0;

    feedbacks.forEach((feedback) => {
      totalRating += feedback.rating;

      if (feedback.rating >= 4) {
        positive++;
      } else if (feedback.rating <= 2) {
        negative++;
      } else {
        neutral++;
      }
    });

    setStats({
      total: feedbacks.length,
      positive,
      negative,
      neutral,
      averageRating: (totalRating / feedbacks.length).toFixed(1),
    });
  };

  const submitFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now().toString(),
      text: feedbackData.text,
      rating: feedbackData.rating,
      name: isAnonymous ? 'Anonymous' : feedbackData.name,
      timestamp: new Date().toISOString(),
      isAnonymous,
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    return true;
  };

  const clearAllFeedbacks = () => {
    setFeedbacks([]);
    AsyncStorage.removeItem('feedbacks');
  };

  // Generate word cloud data
  const getWordCloudData = () => {
    const words = {};
    const commonWords = [
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'can',
      'may',
      'might',
      'must',
      'shall',
      'this',
      'that',
      'these',
      'those',
      'a',
      'an',
    ];

    feedbacks.forEach((feedback) => {
      const text = feedback.text.toLowerCase();
      const wordArray = text.split(/\W+/);

      wordArray.forEach((word) => {
        if (word.length > 2 && !commonWords.includes(word)) {
          words[word] = (words[word] || 0) + 1;
        }
      });
    });

    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({
        text: word,
        value: count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }));
  };

  const value = {
    feedbacks,
    stats,
    isAnonymous,
    setIsAnonymous,
    submitFeedback,
    clearAllFeedbacks,
    getWordCloudData,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
