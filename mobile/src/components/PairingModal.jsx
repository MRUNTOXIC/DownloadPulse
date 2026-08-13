import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { X, Laptop, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react-native';
import { verifyPairingCode } from '../services/api';

export function PairingModal({ visible, onClose, onDevicePaired }) {
  const [pairingCodeInput, setPairingCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [pairedDevice, setPairedDevice] = useState(null);

  const handleVerifyCode = async () => {
    if (!pairingCodeInput.trim()) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const device = await verifyPairingCode(pairingCodeInput.trim());
      setPairedDevice(device);
      if (onDevicePaired) onDevicePaired(device);
    } catch (err) {
      setError(err.message || 'Invalid or expired 6-digit pairing code');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Laptop size={18} color="#000000" />
              <Text style={styles.title}>Pair Computer</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {pairedDevice ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconBox}>
                <CheckCircle2 size={36} color="#166534" />
              </View>
              <Text style={styles.successTitle}>Computer Connected!</Text>
              <Text style={styles.successDesc}>
                <Text style={{ fontWeight: '700', color: '#000000' }}>
                  {pairedDevice.deviceName || pairedDevice.name || 'Desktop PC'}
                </Text>{' '}
                is now securely linked to your account.
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
                <Text style={styles.doneBtnText}>Continue to Feed</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.instructions}>
                Look at the DownloadPulse Desktop Agent window on your PC or Mac and enter the 6-digit pairing code:
              </Text>

              {/* Pairing Code Input */}
              <View style={styles.inputWrapper}>
                <KeyRound size={18} color="#64748B" />
                <TextInput
                  style={styles.codeInput}
                  value={pairingCodeInput}
                  onChangeText={text => {
                    setPairingCodeInput(text);
                    if (error) setError(null);
                  }}
                  placeholder="000000"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleVerifyCode}
                disabled={isVerifying || pairingCodeInput.length < 6}
                style={[
                  styles.verifyBtn,
                  pairingCodeInput.length < 6 && styles.disabledVerifyBtn
                ]}
              >
                <Text style={styles.verifyBtnText}>
                  {isVerifying ? 'Verifying Code...' : 'Pair Computer'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', marginTop: 4 }}>
                <Text style={styles.cancelText}>Cancel</Text>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    marginTop: 12,
    gap: 12
  },
  instructions: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18
  },
  inputWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  codeInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#000000'
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  verifyBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4
  },
  disabledVerifyBtn: {
    backgroundColor: '#94A3B8'
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  cancelText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  successContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12
  },
  successIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  successDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18
  },
  doneBtn: {
    backgroundColor: '#000000',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
