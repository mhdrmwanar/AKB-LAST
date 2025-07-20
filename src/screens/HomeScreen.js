import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Aplikasi Feedback Live</Text>
          <Text style={styles.headerSubtitle}>
            Pilih dashboard Anda untuk memulai
          </Text>
        </View>
      </View>

      {/* Dashboard Selection */}
      <View style={styles.dashboardContainer}>
        <Text style={styles.sectionTitle}>Pilih Dashboard</Text>
        <Text style={styles.sectionSubtitle}>
          Pilih peran Anda untuk mengakses fitur yang sesuai
        </Text>

        {/* User Dashboard Card */}
        <TouchableOpacity
          style={[styles.dashboardCard, styles.userCard]}
          onPress={() => navigation.navigate('UserDashboard')}
          activeOpacity={0.9}
        >
          <View style={styles.cardGradient}>
            <View style={styles.cardIconContainer}>
              <View style={[styles.cardIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="person" size={36} color="#fff" />
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.badgeText}>PENGGUNA</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Dashboard Pengguna</Text>
              <Text style={styles.cardDescription}>
                Kirim feedback, beri rating pengalaman, dan bagikan pendapat
                Anda secara anonim
              </Text>

              <View style={styles.cardFeatures}>
                <View style={styles.featureRow}>
                  <View style={styles.feature}>
                    <Ionicons name="star" size={18} color="#4CAF50" />
                    <Text style={styles.featureText}>Beri Rating</Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color="#4CAF50"
                    />
                    <Text style={styles.featureText}>Mode Anonim</Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.feature}>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={18}
                      color="#4CAF50"
                    />
                    <Text style={styles.featureText}>Feedback Cepat</Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons name="send" size={18} color="#4CAF50" />
                    <Text style={styles.featureText}>Kirim Instan</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Admin Dashboard Card */}
        <TouchableOpacity
          style={[styles.dashboardCard, styles.adminCard]}
          onPress={() => navigation.navigate('TestAdminDashboard')}
          activeOpacity={0.9}
        >
          <View style={styles.cardGradient}>
            <View style={styles.cardIconContainer}>
              <View style={[styles.cardIcon, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="analytics" size={36} color="#fff" />
              </View>
              <View style={[styles.cardBadge, { backgroundColor: '#FF9800' }]}>
                <Text style={styles.badgeText}>ADMIN</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Dashboard Admin</Text>
              <Text style={styles.cardDescription}>
                Pantau analitik feedback, lihat wawasan data, dan kelola sistem
              </Text>

              <View style={styles.cardFeatures}>
                <View style={styles.featureRow}>
                  <View style={styles.feature}>
                    <Ionicons name="bar-chart" size={18} color="#FF9800" />
                    <Text style={styles.featureText}>Analitik Live</Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons name="pie-chart" size={18} color="#FF9800" />
                    <Text style={styles.featureText}>Wawasan Data</Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.feature}>
                    <Ionicons name="cloud" size={18} color="#FF9800" />
                    <Text style={styles.featureText}>Word Cloud</Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons name="time" size={18} color="#FF9800" />
                    <Text style={styles.featureText}>Data Real-time</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color="#FF9800" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Pilih dashboard untuk memulai</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1a237e',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e1e7ff',
    textAlign: 'center',
    opacity: 0.9,
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  dashboardCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  userCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  adminCard: {
    backgroundColor: '#fff7ed',
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  cardGradient: {
    padding: 24,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  cardBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFeatures: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  cardArrow: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    opacity: 0.8,
  },
});
