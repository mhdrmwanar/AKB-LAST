import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { theme } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

const RealtimeVisualization = ({ data }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [previousData, setPreviousData] = useState(data);

  const {
    totalFeedbacks,
    averageRating,
    sentimentAnalysis,
    wordCloud,
    recentFeedbacks,
  } = data;

  // Animate when data changes
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(previousData)) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setPreviousData(data);
    }
  }, [data]);

  // Prepare chart data
  const sentimentData = [
    {
      name: 'Positif',
      population: sentimentAnalysis.positive,
      color: theme.colors.success,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Netral',
      population: sentimentAnalysis.neutral,
      color: theme.colors.warning,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Negatif',
      population: sentimentAnalysis.negative,
      color: theme.colors.error,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const wordCloudArray = Object.entries(wordCloud)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15); // Show more words

  const chartConfig = {
    backgroundColor: theme.colors.white,
    backgroundGradientFrom: theme.colors.white,
    backgroundGradientTo: theme.colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    color = theme.colors.primary,
    icon,
  }) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          borderLeftColor: color,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>
        {icon && <Text style={styles.statIcon}>{icon}</Text>}
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Animated.View>
  );

  const WordCloudItem = ({ word, count, maxCount, index }) => {
    const fontSize = Math.max(14, Math.min(28, (count / maxCount) * 28));
    const opacity = Math.max(0.6, count / maxCount);
    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
    const color = colors[index % colors.length];

    return (
      <View style={[styles.wordItem, { opacity }]}>
        <Text style={[styles.wordText, { fontSize, color }]}>{word}</Text>
        <Text style={styles.wordCount}>({count})</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Respons"
          value={totalFeedbacks}
          subtitle={`${
            totalFeedbacks > 0 ? 'terus bertambah' : 'menunggu feedback'
          }`}
          color={theme.colors.primary}
          icon="📊"
        />
        <StatCard
          title="Rating Rata-rata"
          value={`${averageRating}/5`}
          subtitle={
            totalFeedbacks > 0
              ? `dari ${totalFeedbacks} respons`
              : 'belum ada rating'
          }
          color={
            averageRating >= 4
              ? '#4CAF50'
              : averageRating >= 3
              ? '#FF9800'
              : '#F44336'
          }
          icon="⭐"
        />
      </View>

      {/* Real-time Word Cloud */}
      {wordCloudArray.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Awan Kata Live</Text>
          <View style={styles.wordCloudContainer}>
            {wordCloudArray.map(([word, count], index) => (
              <WordCloudItem
                key={word}
                word={word}
                count={count}
                maxCount={wordCloudArray[0][1]}
                index={index}
              />
            ))}
          </View>
        </View>
      )}

      {/* Sentiment Analysis Chart */}
      {totalFeedbacks > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>😊 Analisis Sentimen</Text>
          <PieChart
            data={sentimentData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 50]}
            absolute
          />
        </View>
      )}

      {/* Word Cloud */}
      {wordCloudArray.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Kata yang Paling Disebut</Text>
          <View style={styles.wordCloudContainer}>
            {wordCloudArray.map(([word, count], index) => (
              <WordCloudItem
                key={index}
                word={word}
                count={count}
                maxCount={wordCloudArray[0][1]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Recent Feedbacks */}
      {recentFeedbacks.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Feedback Terbaru</Text>
          {recentFeedbacks.slice(0, 5).map((feedback, index) => (
            <View key={feedback.id} style={styles.feedbackItem}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackAuthor}>
                  {feedback.participantName}
                </Text>
                <View
                  style={[
                    styles.sentimentBadge,
                    {
                      backgroundColor:
                        feedback.sentiment === 'positive'
                          ? theme.colors.success
                          : feedback.sentiment === 'negative'
                          ? theme.colors.error
                          : theme.colors.warning,
                    },
                  ]}
                >
                  <Text style={styles.sentimentText}>
                    {feedback.sentiment === 'positive'
                      ? 'POSITIF'
                      : feedback.sentiment === 'negative'
                      ? 'NEGATIF'
                      : 'NETRAL'}
                  </Text>
                </View>
              </View>
              <Text style={styles.feedbackTime}>
                {new Date(feedback.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.feedbackPreview} numberOfLines={2}>
                {feedback.answers
                  .filter((answer) => typeof answer === 'string')
                  .join(' ')
                  .substring(0, 100)}
                ...
              </Text>
            </View>
          ))}
        </View>
      )}

      {totalFeedbacks === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Belum Ada Data</Text>
          <Text style={styles.emptyStateText}>
            Visualisasi feedback akan muncul di sini setelah peserta mulai
            mengirimkan respons.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  statSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  chartContainer: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  wordCloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  wordItem: {
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.sm,
  },
  wordText: {
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  wordCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  feedbackItem: {
    backgroundColor: theme.colors.light,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  feedbackAuthor: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  sentimentBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  sentimentText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  feedbackTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  feedbackPreview: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordCloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});

export default RealtimeVisualization;
