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

export default function TestAdminDashboard({ navigation }) {
  const {
    feedbacks,
    stats,
    generateWordCloud,
    clearAllFeedbacks,
    deleteFeedback,
    syncDataFromServer,
    checkServerConnection,
    isOnline,
  } = useFeedback();
  const [refreshing, setRefreshing] = useState(false);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
          <View style={styles.emptyWordCloudContainer}>
            <Ionicons name="cloud-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyComponentTitle}>Word Cloud Kosong</Text>
            <Text style={styles.emptyComponentText}>
              Kata-kata dari feedback akan muncul di sini
            </Text>
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
          <View style={styles.emptyCategoryContainer}>
            <Ionicons name="pie-chart-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyComponentTitle}>Belum Ada Kategori</Text>
            <Text style={styles.emptyComponentText}>
              Analisis kategori akan muncul setelah ada feedback
            </Text>
          </View>
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
          {feedbacks.length > 0 ? (
            [5, 4, 3, 2, 1].map((rating) => (
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
            ))
          ) : (
            <View style={styles.emptyRatingContainer}>
              <Ionicons name="star-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyComponentTitle}>Belum Ada Rating</Text>
              <Text style={styles.emptyComponentText}>
                Distribusi rating akan muncul setelah ada feedback
              </Text>
            </View>
          )}
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
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      isDeleting && styles.deleteButtonDisabled,
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
                  </TouchableOpacity>
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
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Feedback</Text>
            <Text style={styles.emptyDescription}>
              Feedback dari pengguna akan muncul di sini setelah mereka mengirim tanggapan
            </Text>
            <View style={styles.emptyFeatures}>
              <View style={styles.emptyFeatureItem}>
                <Ionicons name="star-outline" size={20} color="#9E9E9E" />
                <Text style={styles.emptyFeatureText}>Rating & Penilaian</Text>
              </View>
              <View style={styles.emptyFeatureItem}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#9E9E9E" />
                <Text style={styles.emptyFeatureText}>Komentar Detail</Text>
              </View>
              <View style={styles.emptyFeatureItem}>
                <Ionicons name="analytics-outline" size={20} color="#9E9E9E" />
                <Text style={styles.emptyFeatureText}>Analisis Otomatis</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => navigation.navigate('UserDashboard')}
            >
              <Ionicons name="add-circle-outline" size={20} color="#2196F3" />
              <Text style={styles.startButtonText}>Kirim Feedback Pertama</Text>
            </TouchableOpacity>
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
          <Text style={styles.headerSubtitle}>
            Wawasan feedback real-time • {Platform.OS === 'web' ? 'Web' : 'Android'} • {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
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
            feedbacks.length > 0 ? stats.total.toString() : '0',
            feedbacks.length > 0 ? 'Semua feedback' : 'Belum ada feedback',
            'people',
            '#2196F3'
          )}
          {renderStatCard(
            'Rating Rata-rata',
            feedbacks.length > 0 && stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
            'Dari 5 bintang',
            'star',
            '#FFD700'
          )}
          {renderStatCard(
            'Kepuasan',
            feedbacks.length > 0 ? `${stats.satisfactionRate || 0}%` : '0%',
            'Rating 4+ bintang',
            'happy',
            '#4CAF50'
          )}
          {renderStatCard(
            'Anonim',
            feedbacks.length > 0 ? stats.anonymous.toString() : '0',
            feedbacks.length > 0 ? 'Feedback pribadi' : 'Belum ada data',
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
          <TouchableOpacity
            style={styles.clearButton}
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
          </TouchableOpacity>
        )}

        {/* Sync Button */}
        <TouchableOpacity
          style={[styles.clearButton, { 
            backgroundColor: isSyncing ? '#ccc' : (isOnline ? '#4CAF50' : '#FF9800'), 
            marginTop: 10 
          }]}
          onPress={async () => {
            if (isSyncing) return;
            
            setIsSyncing(true);
            try {
              if (isOnline) {
                await syncDataFromServer();
                showAlert('Berhasil', 'Data berhasil disinkronkan dari server');
              } else {
                await checkServerConnection();
                showAlert('Mencoba Koneksi', 'Sedang mencoba menghubungkan ke server...');
              }
            } catch (error) {
              showAlert('Error', 'Gagal sinkronisasi data');
            }
            setIsSyncing(false);
          }}
          disabled={isSyncing}
        >
          <Ionicons 
            name={isSyncing ? "sync" : (isOnline ? "cloud-done" : "cloud-offline")} 
            size={16} 
            color="#fff" 
          />
          <Text style={[styles.clearButtonText, { color: '#fff' }]}>
            {isSyncing ? 'Menyinkronkan...' : (isOnline ? 'Sinkronkan Data' : 'Coba Koneksi')}
          </Text>
        </TouchableOpacity>

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
  
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 300,
  },
  emptyFeatures: {
    marginBottom: 32,
    alignItems: 'center',
  },
  emptyFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyFeatureText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginLeft: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    elevation: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
  
  // Component Empty States
  emptyWordCloudContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCategoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyRatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyComponentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyComponentText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    maxWidth: 250,
  },
});
