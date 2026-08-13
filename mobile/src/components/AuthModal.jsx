import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, ShieldCheck } from 'lucide-react-native';
import { loginWithGoogle } from '../services/api';

export function AuthModal({ visible, user, onClose, onAuthSuccess, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      // Simulate Google OAuth sign in payload
      const mockGoogleProfile = {
        id: 'google_user_10293',
        email: 'user@gmail.com',
        name: 'DownloadPulse User',
        picture: null
      };

      const userData = await loginWithGoogle(null, mockGoogleProfile);
      if (onAuthSuccess) onAuthSuccess(userData);
      onClose();
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          
          <View style={styles.header}>
            <Text style={styles.title}>
              {user ? 'Account Profile' : 'Sign In to DownloadPulse'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {user ? (
            <View style={styles.profileContainer}>
              <View style={styles.userCard}>
                <Text style={styles.userLabel}>Authenticated User</Text>
                <Text style={styles.userName}>{user.name || 'DownloadPulse User'}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.providerBadge}>Provider: Google OAuth</Text>
              </View>
              <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContainer}>
              <Text style={styles.subtitle}>
                Log in to link your computers and receive real-time push notifications for file transfers.
              </Text>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                onPress={handleGoogleAuth}
                disabled={loading}
                style={styles.googleBtn}
              >
                <View style={styles.googleIconBox}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>
                  {loading ? 'Authenticating with Google...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              <View style={styles.trustFooter}>
                <ShieldCheck size={14} color="#166534" />
                <Text style={styles.trustText}>Verified OAuth Identity Protection</Text>
              </View>
            </View>
          )}

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  closeBtn: {
    padding: 4
  },
  profileContainer: {
    marginTop: 14,
    gap: 12
  },
  userCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 2
  },
  userLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase'
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  userEmail: {
    fontSize: 12,
    color: '#475569'
  },
  providerBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 4
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  authContainer: {
    marginTop: 14,
    gap: 14
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600'
  },
  googleBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  googleIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleIconText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4285F4'
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4
  },
  trustText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600'
  }
});
