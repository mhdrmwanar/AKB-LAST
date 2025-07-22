import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1421" />

      {/* Background Decorations */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* App Title */}
      <View style={styles.titleContainer}>
        <View style={styles.logoIcon}>
          <Ionicons name="analytics-outline" size={40} color="#64FFDA" />
        </View>
        <Text style={styles.appTitle}>Live Feedback</Text>
        <Text style={styles.appTitle2}>Survey</Text>
        <Text style={styles.appSubtitle}>Pilih mode akses untuk memulai</Text>
      </View>

      {/* Logo Selection */}
      <View style={styles.logoContainer}>
        {/* User Logo */}
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => navigation.navigate('UserDashboard')}
          activeOpacity={0.7}
        >
          <View style={[styles.logoCircle, styles.userLogo]}>
            <View style={styles.logoGlow}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          </View>
          <Text style={styles.logoText}>USER</Text>
          <Text style={styles.logoSubtext}>Berikan feedback</Text>
        </TouchableOpacity>

        {/* Admin Logo */}
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => navigation.navigate('TestAdminDashboard')}
          activeOpacity={0.7}
        >
          <View style={[styles.logoCircle, styles.adminLogo]}>
            <View style={styles.logoGlow}>
              <Ionicons name="shield-checkmark" size={50} color="#fff" />
            </View>
          </View>
          <Text style={styles.logoText}>ADMIN</Text>
          <Text style={styles.logoSubtext}>Kelola sistem</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1421',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#64FFDA',
    top: -150,
    right: -150,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#FF6B6B',
    bottom: -100,
    left: -100,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: '#4ECDC4',
    top: '50%',
    left: -75,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          textShadow: '0px 0px 10px rgba(100, 255, 218, 0.3)',
        }
      : {
          textShadowColor: 'rgba(100, 255, 218, 0.3)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }),
  },
  appTitle2: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#64FFDA',
    textAlign: 'center',
    marginBottom: 10,
    ...(Platform.OS === 'web'
      ? {
          textShadow: '0px 0px 20px rgba(100, 255, 218, 0.5)',
        }
      : {
          textShadowColor: 'rgba(100, 255, 218, 0.5)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
        }),
  },
  appSubtitle: {
    fontSize: 16,
    color: '#B0BEC5',
    textAlign: 'center',
    opacity: 0.8,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 350,
  },
  logoButton: {
    alignItems: 'center',
    padding: 15,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userLogo: {
    backgroundColor: '#1E88E5',
    shadowColor: '#1E88E5',
  },
  adminLogo: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 5,
    ...(Platform.OS === 'web'
      ? {
          textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
        }
      : {
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
        }),
  },
  logoSubtext: {
    fontSize: 12,
    color: '#B0BEC5',
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});
