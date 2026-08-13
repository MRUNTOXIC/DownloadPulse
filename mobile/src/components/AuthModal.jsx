import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { X, ShieldCheck } from 'lucide-react-native';
import { loginUser, registerUser } from '../services/api';

export function AuthModal({ visible, user, onClose, onAuthSuccess, onLogout }) {
  const [email, setEmail] = useState('user@downloadpulse.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Rivers');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      let userData;
      if (isRegistering) {
        userData = await registerUser(email, password, name);
      } else {
        userData = await loginUser(email, password);
      }
      if (onAuthSuccess) onAuthSuccess(userData);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          
          <View style={styles.header}>
            <Text style={styles.title}>
              {user ? 'Account Profile' : isRegistering ? 'Create Account' : 'Log In to Pulse'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {user ? (
            <View style={styles.profileContainer}>
              <View style={styles.userCard}>
                <Text style={styles.userLabel}>Logged in User</Text>
                <Text style={styles.userName}>{user.name || user.email}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              {isRegistering && (
                <View style={styles.field}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Alex Rivers"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="user@downloadpulse.io"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>
                  {submitting ? 'Authenticating...' : isRegistering ? 'Register Account' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsRegistering(!isRegistering)}
                style={styles.switchBtn}
              >
                <Text style={styles.switchText}>
                  {isRegistering ? 'Already have an account? Log In' : 'Need an account? Register'}
                </Text>
              </TouchableOpacity>
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  userLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase'
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  userEmail: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1
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
  formContainer: {
    marginTop: 14,
    gap: 12
  },
  field: {
    gap: 4
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: '#0F172A'
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600'
  },
  submitBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  switchBtn: {
    alignItems: 'center',
    paddingVertical: 6
  },
  switchText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  }
});
