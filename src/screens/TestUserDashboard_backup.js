// Backup of TestUserDashboard - Working Version with Modern Dark Theme
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
  StatusBar,
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
    { id: 'general', label: 'Umum', icon: 'chatbox', color: '#64FFDA' },
    { id: 'service', label: 'Layanan', icon: 'people', color: '#1E88E5' },
    { id: 'product', label: 'Produk', icon: 'cube', color: '#FF6B35' },
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
      await submitFeedback({
        name: isAnonymous ? 'Anonim' : name,
        text: feedbackText,
        rating,
        category: selectedCategory,
        isAnonymous,
      });

      Alert.alert(
        'Berhasil',
        'Feedback Anda telah berhasil dikirim. Terima kasih!',
        [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setFeedbackText('');
              setRating(0);
              setSelectedCategory('general');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim feedback. Silakan coba lagi.');
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
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#FFD700' : '#546E7A'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D1421" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#64FFDA" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>User Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Berikan feedback untuk perbaikan layanan
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('TestAdminDashboard')}
          style={styles.analyticsButton}
        >
          <Ionicons name="analytics" size={20} color="#64FFDA" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalFeedbacks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {stats.averageRating.toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Rata-rata</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.todayCount}</Text>
          <Text style={styles.statLabel}>Hari ini</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        overScrollMode="always"
        scrollEventThrottle={16}
      >
        {/* Anonymous Toggle */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mode Privasi</Text>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Ionicons
                name={isAnonymous ? 'shield-checkmark' : 'person'}
                size={24}
                color={isAnonymous ? '#64FFDA' : '#B0BEC5'}
              />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>
                  {isAnonymous ? 'Mode Anonim' : 'Mode Terbuka'}
                </Text>
                <Text style={styles.toggleSubtext}>
                  {isAnonymous
                    ? 'Identitas Anda akan disembunyikan'
                    : 'Nama Anda akan ditampilkan'}
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#263244', true: '#64FFDA' }}
              thumbColor={isAnonymous ? '#FFFFFF' : '#B0BEC5'}
            />
          </View>
        </View>

        {/* Name Input */}
        {!isAnonymous && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nama Anda</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nama Anda"
              placeholderTextColor="#546E7A"
              value={name}
              onChangeText={setName}
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
                  selectedCategory === category.id && styles.categoryCardActive,
                  { borderColor: category.color },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={
                    selectedCategory === category.id
                      ? category.color
                      : '#546E7A'
                  }
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && {
                      color: category.color,
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
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rating Kepuasan</Text>
          <Text style={styles.ratingSubtext}>
            Berikan rating dari 1-5 bintang
          </Text>
          {renderStars()}
          <Text style={styles.ratingText}>
            {rating > 0
              ? `Anda memberikan ${rating} bintang`
              : 'Belum ada rating'}
          </Text>
        </View>

        {/* Feedback Text */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Feedback Anda</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Tulis feedback, saran, atau kritik Anda di sini..."
            placeholderTextColor="#546E7A"
            multiline
            numberOfLines={4}
            value={feedbackText}
            onChangeText={setFeedbackText}
            maxLength={500}
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
            <Text style={styles.submitButtonText}>Mengirim...</Text>
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
    backgroundColor: '#0D1421',
  },
  header: {
    backgroundColor: '#1A2332',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#263244',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }),
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B0BEC5',
    marginTop: 2,
  },
  analyticsButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  statsBar: {
    backgroundColor: '#1A2332',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#263244',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64FFDA',
  },
  statLabel: {
    fontSize: 12,
    color: '#B0BEC5',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#263244',
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    backgroundColor: '#0D1421',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#263244',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
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
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleSubtext: {
    fontSize: 12,
    color: '#B0BEC5',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: '#263244',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#37474F',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    marginTop: 8,
    color: '#B0BEC5',
    fontSize: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#263244',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#37474F',
  },
  categoryCardActive: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0BEC5',
    marginTop: 8,
    textAlign: 'center',
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
    marginHorizontal: 2,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#B0BEC5',
  },
  submitButton: {
    backgroundColor: '#64FFDA',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 4px 8px rgba(100, 255, 218, 0.3)',
        }
      : {
          shadowColor: '#64FFDA',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }),
  },
  submitButtonDisabled: {
    backgroundColor: '#37474F',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: 'none',
        }
      : {
          shadowOpacity: 0,
        }),
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
