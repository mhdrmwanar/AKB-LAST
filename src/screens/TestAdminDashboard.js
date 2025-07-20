import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '../context/FeedbackContext';

// Cross-platform Alert wrapper
const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    // For web, use window.confirm for simple dialogs
    if (buttons && buttons.length === 2) {
      const result = window.confirm(`${title}\n\n${message}`);
      if (result && buttons[1].onPress) {
        buttons[1].onPress();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    // For mobile, use React Native Alert
    Alert.alert(title, message, buttons);
  }
};

// Cross-platform TouchableButton wrapper
const TouchableButton = ({ children, onPress, style, disabled, ...props }) => {
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          style,
          pressed && { opacity: 0.7 },
          disabled && { opacity: 0.5 },
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={style}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
};

export default function TestAdminDashboard({ navigation }) {
  const {
    feedbacks,
    stats,
    generateWordCloud,
    clearAllFeedbacks,
    deleteFeedback,
  } = useFeedback();
  const [refreshing, setRefreshing] = useState(false);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

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

  const handleDeleteFeedback = (feedbackId, feedbackText) => {
    if (isDeleting) return; // Prevent multiple clicks

    console.log('handleDeleteFeedback called with:', {
      feedbackId,
      feedbackText,
      feedbacksCount: feedbacks.length,
    });

    if (!feedbackId) {
      showAlert('Error', 'ID feedback tidak ditemukan');
      return;
    }

    showAlert(
      'Hapus Feedback',
      `Apakah Anda yakin ingin menghapus feedback: "${feedbackText?.substring(
        0,
        50
      )}${feedbackText?.length > 50 ? '...' : ''}"?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            console.log('User confirmed delete for platform:', Platform.OS);
            setIsDeleting(true);
            console.log('Attempting to delete feedback ID:', feedbackId);
            const success = await deleteFeedback(feedbackId);
            setIsDeleting(false);

            if (success) {
              showAlert('Berhasil', 'Feedback berhasil dihapus');
            } else {
              showAlert('Error', 'Gagal menghapus feedback');
            }
          },
        },
      ]
    );
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

  const renderAllFeedback = () => {
    const allFeedback = feedbacks.slice().reverse(); // Show newest first

    console.log(
      'renderAllFeedback - feedbacks data:',
      feedbacks.map((f) => ({
        id: f.id,
        hasId: !!f.id,
        text: f.text?.substring(0, 20),
      }))
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Semua Feedback</Text>
          <Text style={styles.cardSubtitle}>
            {feedbacks.length > 0
              ? `${feedbacks.length} feedback total`
              : 'Belum ada feedback'}
          </Text>
        </View>
        {allFeedback.length > 0 ? (
          allFeedback.map((item, index) => {
            const feedbackId = item.id || `feedback-${index}-${Date.now()}`;
            console.log('Rendering feedback:', {
              id: feedbackId,
              originalId: item.id,
              text: item.text?.substring(0, 20),
            });

            return (
              <View key={feedbackId} style={styles.feedbackItem}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.feedbackHeaderLeft}>
                    <Text style={styles.feedbackName}>
                      {item.isAnonymous ? 'Anonim' : item.name || 'Pengguna'}
                    </Text>
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
                  <TouchableButton
                    style={[
                      styles.deleteButton,
                      isDeleting && styles.deleteButtonDisabled,
                      Platform.OS === 'web' && { cursor: isDeleting ? 'not-allowed' : 'pointer' },
                    ]}
                    onPress={() =>
                      handleDeleteFeedback(
                        feedbackId,
                        item.message || item.text
                      )
                    }
                    disabled={isDeleting}
                  >
                    <Ionicons
                      name={isDeleting ? 'hourglass-outline' : 'trash-outline'}
                      size={16}
                      color={isDeleting ? '#ccc' : '#F44336'}
                    />
                  </TouchableButton>
                </View>
                <Text style={styles.feedbackText} numberOfLines={3}>
                  {item.message || item.text}
                </Text>
                <View style={styles.feedbackMeta}>
                  <Text style={styles.feedbackCategory}>
                    {item.category === 'general'
                      ? 'Umum'
                      : item.category === 'service'
                      ? 'Layanan'
                      : item.category === 'product'
                      ? 'Produk'
                      : item.category === 'suggestion'
                      ? 'Saran'
                      : item.category?.charAt(0).toUpperCase() +
                          item.category?.slice(1) || 'Umum'}
                  </Text>
                  <Text style={styles.feedbackTime}>
                    {new Date(item.timestamp).toLocaleDateString('id-ID')}{' '}
                    {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyFeedback}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada feedback</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableButton
          onPress={() => navigation.goBack()}
          style={[styles.backButton, Platform.OS === 'web' && { cursor: 'pointer' }]}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableButton>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard Analitik</Text>
          <Text style={styles.headerSubtitle}>Wawasan feedback real-time</Text>
        </View>
        <TouchableButton
          onPress={() => navigation.navigate('UserDashboard')}
          style={[styles.addButton, Platform.OS === 'web' && { cursor: 'pointer' }]}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableButton>
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
            stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            'Dari 5 bintang',
            'star',
            '#FFD700'
          )}
          {renderStatCard(
            'Kepuasan',
            `${stats.satisfactionRate || 0}%`,
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
        {renderAllFeedback()}

        {/* Clear Data Button */}
        {stats.total > 0 && (
          <TouchableButton
            style={[
              styles.clearButton, 
              Platform.OS === 'web' && { cursor: 'pointer' }
            ]}
            onPress={() => {
              showAlert(
                'Hapus Semua Data',
                'Apakah Anda yakin ingin menghapus semua data feedback? Tindakan ini tidak dapat dibatalkan.',
                [
                  {
                    text: 'Batal',
                    style: 'cancel',
                  },
                  {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                      console.log(
                        'User confirmed clear all for platform:',
                        Platform.OS
                      );
                      const success = await clearAllFeedbacks();
                      if (success) {
                        showAlert(
                          'Berhasil',
                          'Semua data feedback berhasil dihapus'
                        );
                      } else {
                        showAlert('Error', 'Gagal menghapus data feedback');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash" size={16} color="#F44336" />
            <Text style={styles.clearButtonText}>Hapus Semua Data</Text>
          </TouchableButton>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      minHeight: '100vh',
    }),
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
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
    ...(Platform.OS === 'web' && {
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
    }),
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
    // Cross-platform shadows
    ...(Platform.OS === 'web' 
      ? {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }
    ),
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
    // Cross-platform shadows
    ...(Platform.OS === 'web' 
      ? {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }
    ),
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
  feedbackHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  feedbackRating: {
    flexDirection: 'row',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
    // Cross-platform touch feedback
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#FFF5F5',
      },
    }),
  },
  deleteButtonDisabled: {
    opacity: 0.5,
    borderColor: '#ccc',
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 20,
    marginHorizontal: 20,
    // Cross-platform touch feedback
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#FFF5F5',
        borderColor: '#E53935',
      },
    }),
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
