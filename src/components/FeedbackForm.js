import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const FeedbackForm = ({ onClose }) => {
  const [feedback, setFeedback] = useState({
    subject: '',
    message: '',
    rating: 0,
  });

  const handleSubmit = () => {
    if (!feedback.subject.trim() || !feedback.message.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (feedback.rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    // Simulate submission
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setFeedback((prev) => ({ ...prev, rating: star }))}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= feedback.rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= feedback.rating ? '#FFD700' : theme.colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Send Feedback</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              value={feedback.subject}
              onChangeText={(text) =>
                setFeedback((prev) => ({ ...prev, subject: text }))
              }
              placeholder="Brief description of your feedback"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rating *</Text>
            {renderStars()}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={feedback.message}
              onChangeText={(text) =>
                setFeedback((prev) => ({ ...prev, message: text }))
              }
              placeholder="Please share your detailed feedback..."
              placeholderTextColor={theme.colors.textLight}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  form: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  starButton: {
    marginHorizontal: theme.spacing.xs,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});

export default FeedbackForm;
