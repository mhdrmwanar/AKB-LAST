import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '../context/FeedbackContext';

export default function ResultsScreen() {
  const { feedbacks, stats, getWordCloudData, clearAllFeedbacks } =
    useFeedback();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // stats, wordcloud, recent

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Pie chart data for sentiment analysis
  const sentimentData = [
    {
      name: 'Positive',
      population: stats.positive,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Neutral',
      population: stats.neutral,
      color: '#FF9800',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Negative',
      population: stats.negative,
      color: '#F44336',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ].filter((item) => item.population > 0);

  // Bar chart data for ratings
  const ratingData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        data: [
          feedbacks.filter((f) => f.rating === 1).length,
          feedbacks.filter((f) => f.rating === 2).length,
          feedbacks.filter((f) => f.rating === 3).length,
          feedbacks.filter((f) => f.rating === 4).length,
          feedbacks.filter((f) => f.rating === 5).length,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const renderStatCard = (icon, title, value, color) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderWordCloud = () => {
    const wordData = getWordCloudData();

    if (wordData.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={48} color="#DDD" />
          <Text style={styles.emptyText}>No feedback text available yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.wordCloudContainer}>
        {wordData.map((word, index) => (
          <View
            key={index}
            style={[
              styles.wordTag,
              {
                backgroundColor: word.color + '20',
                borderColor: word.color,
              },
            ]}
          >
            <Text style={[styles.wordText, { color: word.color }]}>
              {word.text} ({word.value})
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.feedbackName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(item.rating)].map((_, i) => (
            <Ionicons key={i} name="star" size={12} color="#FFD700" />
          ))}
        </View>
      </View>
      <Text style={styles.feedbackText}>{item.text}</Text>
      <Text style={styles.feedbackTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'stats') {
      return (
        <ScrollView>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            {renderStatCard('people', 'Total Feedback', stats.total, '#2196F3')}
            {renderStatCard(
              'star',
              'Avg Rating',
              stats.averageRating,
              '#FFD700'
            )}
            {renderStatCard('happy', 'Positive', stats.positive, '#4CAF50')}
            {renderStatCard('sad', 'Negative', stats.negative, '#F44336')}
          </View>

          {/* Charts */}
          {stats.total > 0 && (
            <>
              {/* Sentiment Pie Chart */}
              {sentimentData.length > 0 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Sentiment Analysis</Text>
                  <PieChart
                    data={sentimentData}
                    width={chartWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </View>
              )}

              {/* Rating Bar Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Rating Distribution</Text>
                <BarChart
                  data={ratingData}
                  width={chartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  yAxisSuffix=""
                  showValuesOnTopOfBars
                />
              </View>
            </>
          )}
        </ScrollView>
      );
    }

    if (activeTab === 'wordcloud') {
      return (
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Word Cloud</Text>
            {renderWordCloud()}
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'recent') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Feedback</Text>
          {feedbacks.length > 0 ? (
            <FlatList
              data={feedbacks.slice(0, 10)}
              renderItem={renderFeedbackItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#DDD" />
              <Text style={styles.emptyText}>No feedback available yet</Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Indicator */}
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'stats' && styles.activeTabText,
            ]}
          >
            Statistics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'wordcloud' && styles.activeTab]}
          onPress={() => setActiveTab('wordcloud')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'wordcloud' && styles.activeTabText,
            ]}
          >
            Word Cloud
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recent' && styles.activeTabText,
            ]}
          >
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>

      {/* Clear Data Button */}
      {stats.total > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            clearAllFeedbacks();
          }}
        >
          <Ionicons name="trash" size={16} color="#F44336" />
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    flex: 1,
  },
  refreshButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  wordCloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    margin: 4,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  feedbackItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  clearButtonText: {
    color: '#F44336',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
