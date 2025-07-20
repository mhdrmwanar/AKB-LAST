import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '../context/FeedbackContext';

export default function TestUserDashboard({ navigation }) {
  const { isAnonymous, setIsAnonymous, submitFeedback, stats } = useFeedback();

  const [name, setName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'Umum', icon: 'chatbox', color: '#2196F3' },
    { id: 'service', label: 'Layanan', icon: 'people', color: '#4CAF50' },
    { id: 'product', label: 'Produk', icon: 'cube', color: '#FF9800' },
    { id: 'suggestion', label: 'Saran', icon: 'bulb', color: '#9C27B0' },
  ];

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Informasi Kurang', 'Silakan masukkan feedback Anda');
      return;
    }

    if (rating === 0) {
      Alert.alert('Informasi Kurang', 'Silakan pilih rating');
      return;
    }

    if (!isAnonymous && !name.trim()) {
      Alert.alert(
        'Informasi Kurang',
        'Silakan masukkan nama Anda atau aktifkan mode anonim'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const success = submitFeedback({
        text: feedbackText,
        rating: rating,
        name: name.trim() || 'Anonymous',
        category: selectedCategory,
      });

      if (success) {
        Alert.alert('Terima Kasih!', 'Feedback Anda berhasil dikirim!', [
          {
            text: 'Lihat Analitik',
            onPress: () => {
              resetForm();
              navigation.navigate('AdminDashboard');
            },
          },
          {
            text: 'Kirim Lagi',
            onPress: () => resetForm(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Gagal Mengirim', 'Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setFeedbackText('');
    setRating(0);
    setSelectedCategory('general');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        <Text style={styles.ratingLabel}>Beri nilai pengalaman Anda</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.star}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? '#FFD700' : '#DDD'}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {
              ['', 'Buruk', 'Kurang', 'Baik', 'Sangat Baik', 'Luar Biasa'][
                rating
              ]
            }
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Kirim Feedback</Text>
          <Text style={styles.headerSubtitle}>
            Bantu kami meningkatkan layanan
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminDashboard')}
          style={styles.analyticsButton}
        >
          <Ionicons name="analytics" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color="#4CAF50" />
          <Text style={styles.statText}>{stats.total} tanggapan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>
            {stats.averageRating || '0'} rata-rata
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Anonymous Toggle */}
        <View style={styles.card}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Feedback Anonim</Text>
                <Text style={styles.toggleSubtext}>
                  Identitas Anda akan tetap rahasia
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#DDD', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Name Input */}
        {!isAnonymous && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nama Anda</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}

        {/* Category Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kategori Feedback</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={
                    selectedCategory === category.id ? category.color : '#666'
                  }
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && {
                      color: category.color,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.card}>{renderStars()}</View>

        {/* Feedback Text */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Feedback Anda</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Silakan bagikan feedback, saran, atau keluhan Anda secara detail..."
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCounter}>
            {feedbackText.length}/500 karakter
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Ionicons name="hourglass" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Mengirim...</Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Kirim Feedback</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  analyticsButton: {
    padding: 8,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleTextContainer: {
    marginLeft: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  toggleSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  starsContainer: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    marginHorizontal: 4,
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#BBB',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
