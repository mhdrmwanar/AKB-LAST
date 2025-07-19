import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const Dashboard = ({ userRole }) => {
  const adminCards = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: 'people-outline',
      color: theme.colors.primary,
      change: '+12%',
    },
    {
      title: 'Active Sessions',
      value: '89',
      icon: 'pulse-outline',
      color: theme.colors.success,
      change: '+5%',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: 'server-outline',
      color: theme.colors.info,
      change: '99.9%',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: 'trending-up-outline',
      color: theme.colors.warning,
      change: '+8%',
    },
  ];

  const userCards = [
    {
      title: 'My Profile',
      value: 'Complete',
      icon: 'person-outline',
      color: theme.colors.primary,
      change: '100%',
    },
    {
      title: 'My Orders',
      value: '15',
      icon: 'bag-outline',
      color: theme.colors.success,
      change: '+3',
    },
    {
      title: 'Notifications',
      value: '7',
      icon: 'notifications-outline',
      color: theme.colors.warning,
      change: 'New',
    },
    {
      title: 'Settings',
      value: 'Updated',
      icon: 'settings-outline',
      color: theme.colors.info,
      change: 'Today',
    },
  ];

  const cards = userRole === 'admin' ? adminCards : userCards;

  const quickActions =
    userRole === 'admin'
      ? [
          {
            title: 'User Management',
            icon: 'people-outline',
            color: theme.colors.primary,
          },
          {
            title: 'System Logs',
            icon: 'document-text-outline',
            color: theme.colors.success,
          },
          {
            title: 'Analytics',
            icon: 'analytics-outline',
            color: theme.colors.warning,
          },
          {
            title: 'Settings',
            icon: 'settings-outline',
            color: theme.colors.info,
          },
        ]
      : [
          {
            title: 'My Account',
            icon: 'person-outline',
            color: theme.colors.primary,
          },
          {
            title: 'Order History',
            icon: 'time-outline',
            color: theme.colors.success,
          },
          {
            title: 'Support',
            icon: 'help-circle-outline',
            color: theme.colors.warning,
          },
          {
            title: 'Feedback',
            icon: 'chatbubble-outline',
            color: theme.colors.info,
          },
        ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.cardGrid}>
            {cards.map((card, index) => (
              <View key={index} style={styles.card}>
                <View
                  style={[styles.cardIcon, { backgroundColor: card.color }]}
                >
                  <Ionicons
                    name={card.icon}
                    size={24}
                    color={theme.colors.white}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardValue}>{card.value}</Text>
                  <Text style={[styles.cardChange, { color: card.color }]}>
                    {card.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <View
                  style={[styles.actionIcon, { backgroundColor: action.color }]}
                >
                  <Ionicons
                    name={action.icon}
                    size={28}
                    color={theme.colors.white}
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {[1, 2, 3, 4].map((item, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name={
                      index % 2 === 0
                        ? 'checkmark-circle'
                        : 'information-circle'
                    }
                    size={20}
                    color={
                      index % 2 === 0 ? theme.colors.success : theme.colors.info
                    }
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {userRole === 'admin'
                      ? `System ${
                          index % 2 === 0 ? 'update' : 'backup'
                        } completed`
                      : `${
                          index % 2 === 0 ? 'Order' : 'Profile'
                        } updated successfully`}
                  </Text>
                  <Text style={styles.activityTime}>
                    {index + 1} hour{index > 0 ? 's' : ''} ago
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: '1%',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  cardValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardChange: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  actionCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginHorizontal: '1%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  actionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  activityTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
});

export default Dashboard;
