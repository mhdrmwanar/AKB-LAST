import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '../context/FeedbackContext';

export default function TestAdminDashboard({ navigation }) {
  const { feedbacks, stats, generateWordCloud } = useFeedback();
  const [refreshing, setRefreshing] = useState(false);
  const [wordCloudData, setWordCloudData] = useState([]);

  useEffect(() => {
    const data = generateWordCloud();
    setWordCloudData(data.slice(0, 15)); // Top 15 words
  }, [feedbacks]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCategoryStats = () => {
    // Check if feedbacks exists and is an array
    if (!feedbacks || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      return [];
    }

    const categories = {};
    feedbacks.forEach((item) => {
      const category = item.category || 'general';
      if (!categories[category]) {
        categories[category] = { count: 0, totalRating: 0 };
      }
      categories[category].count++;
      categories[category].totalRating += item.rating;
    });

    return Object.keys(categories).map((key) => ({
      name: key,
      count: categories[key].count,
      averageRating: (
        categories[key].totalRating / categories[key].count
      ).toFixed(1),
      percentage: ((categories[key].count / feedbacks.length) * 100).toFixed(1),
    }));
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((item) => {
      distribution[item.rating] = (distribution[item.rating] || 0) + 1;
    });
    return distribution;
  };

  const renderStatCard = (title, value, subtitle, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardText}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={[styles.statCardValue, { color }]}>{value}</Text>
          <Text style={styles.statCardSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const renderWordCloud = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Word Cloud</Text>
        <Text style={styles.cardSubtitle}>
          Kata-kata yang paling sering disebutkan
        </Text>
      </View>
      <View style={styles.wordCloudContainer}>
        {wordCloudData.length > 0 ? (
          wordCloudData.map((word, index) => {
            const fontSize = Math.max(12, 20 - index * 1);
            const opacity = Math.max(0.5, 1 - index * 0.04);
            return (
              <View key={word.text} style={styles.wordCloudItem}>
                <Text style={[styles.wordCloudText, { fontSize, opacity }]}>
                  {word.text} ({word.value})
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyWordCloud}>
            <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada data feedback</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCategoryAnalysis = () => {
    const categoryStats = getCategoryStats();

    const categoryColors = {
      general: '#2196F3',
      service: '#4CAF50',
      product: '#FF9800',
      suggestion: '#9C27B0',
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Analisis Kategori</Text>
          <Text style={styles.cardSubtitle}>
            Distribusi feedback berdasarkan kategori
          </Text>
        </View>
        {categoryStats.length > 0 ? (
          categoryStats.map((category) => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.categoryDot,
                      {
                        backgroundColor:
                          categoryColors[category.name] || '#666',
                      },
                    ]}
                  />
                  <Text style={styles.categoryName}>
                    {category.name === 'general'
                      ? 'Umum'
                      : category.name === 'service'
                      ? 'Layanan'
                      : category.name === 'product'
                      ? 'Produk'
                      : category.name === 'suggestion'
                      ? 'Saran'
                      : category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)}
                  </Text>
                </View>
                <Text style={styles.categoryCount}>
                  {category.count} tanggapan
                </Text>
              </View>
              <View style={styles.categoryBar}>
                <View
                  style={[
                    styles.categoryBarFill,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: categoryColors[category.name] || '#666',
                    },
                  ]}
                />
              </View>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryPercentage}>
                  {category.percentage}%
                </Text>
                <Text style={styles.categoryRating}>
                  ⭐ {category.averageRating}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Data kategori tidak tersedia</Text>
        )}
      </View>
    );
  };

  const renderRatingDistribution = () => {
    const distribution = getRatingDistribution();
    const maxCount = Math.max(...Object.values(distribution));

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Distribusi Rating</Text>
          <Text style={styles.cardSubtitle}>
            Bagaimana pengguna menilai pengalaman mereka
          </Text>
        </View>
        <View style={styles.ratingChart}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <View key={rating} style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>{rating} ⭐</Text>
              <View style={styles.ratingBarContainer}>
                <View
                  style={[
                    styles.ratingBar,
                    {
                      width:
                        maxCount > 0
                          ? `${(distribution[rating] / maxCount) * 100}%`
                          : '0%',
                      backgroundColor:
                        rating >= 4
                          ? '#4CAF50'
                          : rating >= 3
                          ? '#FF9800'
                          : '#F44336',
                    },
                  ]}
                />
              </View>
              <Text style={styles.ratingCount}>{distribution[rating]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRecentFeedback = () => {
    const recentFeedback = feedbacks.slice(-5).reverse();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Feedback Terbaru</Text>
          <Text style={styles.cardSubtitle}>Feedback terkini yang masuk</Text>
        </View>
        {recentFeedback.length > 0 ? (
          recentFeedback.map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackName}>{item.name}</Text>
                <View style={styles.feedbackRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= item.rating ? 'star' : 'star-outline'}
                      size={12}
                      color={star <= item.rating ? '#FFD700' : '#DDD'}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.feedbackText} numberOfLines={2}>
                {item.text}
              </Text>
              <View style={styles.feedbackMeta}>
                <Text style={styles.feedbackCategory}>
                  {item.category?.charAt(0).toUpperCase() +
                    item.category?.slice(1)}
                </Text>
                <Text style={styles.feedbackTime}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyFeedback}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada feedback terbaru</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard Analitik</Text>
          <Text style={styles.headerSubtitle}>Wawasan feedback real-time</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserDashboard')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {renderStatCard(
            'Total Tanggapan',
            stats.total.toString(),
            'Semua feedback',
            'people',
            '#2196F3'
          )}
          {renderStatCard(
            'Rating Rata-rata',
            stats.averageRating || '0',
            'Dari 5 bintang',
            'star',
            '#FFD700'
          )}
          {renderStatCard(
            'Kepuasan',
            stats.satisfactionRate || '0%',
            'Rating 4+ bintang',
            'happy',
            '#4CAF50'
          )}
          {renderStatCard(
            'Anonim',
            stats.anonymous.toString(),
            'Feedback pribadi',
            'shield',
            '#9C27B0'
          )}
        </View>

        {/* Charts and Analysis */}
        {renderWordCloud()}
        {renderCategoryAnalysis()}
        {renderRatingDistribution()}
        {renderRecentFeedback()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    height: '100vh', // For web compatibility
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 2,
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    maxHeight: 'calc(100vh - 120px)', // Subtract header height
  },
  contentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardText: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  wordCloudContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordCloudItem: {
    margin: 4,
  },
  wordCloudText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyWordCloud: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  categoryBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  categoryBarFill: {
    height: 6,
    borderRadius: 3,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryRating: {
    fontSize: 14,
    color: '#666',
  },
  ratingChart: {
    paddingVertical: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    width: 50,
    fontSize: 14,
    color: '#666',
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  ratingBar: {
    height: 8,
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  feedbackItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  feedbackRating: {
    flexDirection: 'row',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackCategory: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  feedbackTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyFeedback: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  bottomPadding: {
    height: 40,
  },
});
