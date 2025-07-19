import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '../context/FeedbackContext';

export default function HomeScreen({ navigation }) {
  const { stats, submitFeedback } = useFeedback();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedbackText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Pilih rating Anda (1-5 bintang)');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = submitFeedback({
        text: feedback || 'Tidak ada komentar',
        rating: rating,
        name: 'Anonymous',
        timestamp: new Date().toISOString(),
      });

      if (success) {
        Alert.alert('Terima kasih!', 'Feedback Anda berhasil dikirim!', [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setFeedbackText('');
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim feedback. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.star}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? '#FFD700' : '#666'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Ionicons name="analytics" size={20} color="#fff" />
          <Text style={styles.adminButtonText}>Dashboard Admin</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleContainer}>
          <Ionicons name="chatbubble-ellipses" size={48} color="#00bcd4" />
          <Text style={styles.title}>Survey Feedback</Text>
          <Text style={styles.subtitle}>
            Berikan feedback Anda dan lihat hasilnya secara realtime!
          </Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>
            Berikan rating Anda (1-5 bintang):
          </Text>
          {renderStars()}
          <Text style={styles.ratingHint}>Pilih rating Anda</Text>
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>Komentar (opsional):</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tuliskan feedback, saran, atau komentar Anda di sini..."
            placeholderTextColor="#999"
            value={feedback}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.anonymousContainer}
          onPress={() => setIsAnonymous(!isAnonymous)}
        >
          <View
            style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}
          >
            {isAnonymous && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.anonymousText}>Kirim sebagai anonymous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'MENGIRIM...' : 'KIRIM FEEDBACK'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Ionicons name="bar-chart" size={16} color="#00bcd4" />
            <Text style={styles.statsTitle}>Statistik Live</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Feedback</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {stats.averageRating || '0.0'}
              </Text>
              <Text style={styles.statLabel}>Rating Rata-rata</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.positive || '0'}</Text>
              <Text style={styles.statLabel}>Feedback Positif</Text>
            </View>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('UserDashboard')}
          >
            <Ionicons name="person" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Dashboard User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
    height: '100vh', // For web compatibility
  },
  header: {
    backgroundColor: '#1a237e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  content: {
    flex: 1,
    maxHeight: 'calc(100vh - 90px)', // Subtract header height
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00bcd4',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  ratingSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  star: {
    marginHorizontal: 8,
    padding: 4,
  },
  ratingHint: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.7,
  },
  feedbackSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  anonymousContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00bcd4',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00bcd4',
  },
  anonymousText: {
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#00bcd4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00bcd4',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  navigationContainer: {
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
