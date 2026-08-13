import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { X, Laptop, CheckCircle2, Clock, Monitor, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { generatePairingCode, pairDevice } from '../services/api';

export function PairingModal({ visible, onClose, onDevicePaired }) {
  const [pairingCode, setPairingCode] = useState('482931');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [simulatedDeviceName, setSimulatedDeviceName] = useState('Workstation-PC');
  const [isConfirming, setIsConfirming] = useState(false);
  const [pairedDevice, setPairedDevice] = useState(null);

  const startPairingSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generatePairingCode();
      setPairingCode(data.pairingCode || '482931');
      setTimeLeft(300);
    } catch (err) {
      setError(err.message || 'Failed to generate pairing code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      startPairingSession();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, timeLeft]);

  const handleSimulateAgentConfirm = async () => {
    setIsConfirming(true);
    setError(null);
    try {
      const device = await pairDevice(pairingCode, simulatedDeviceName, 'windows');
      setPairedDevice(device);
      if (onDevicePaired) onDevicePaired(device);
    } catch (err) {
      setError(err.message || 'Pairing failed');
    } finally {
      setIsConfirming(false);
    }
  };

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Laptop size={18} color="#000000" />
              <Text style={styles.title}>Pair New Computer</Text>
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
              <Text style={styles.successTitle}>Computer Paired!</Text>
              <Text style={styles.successDesc}>
                {pairedDevice.name || pairedDevice.deviceName} is now associated with your DownloadPulse account.
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.instructions}>
                Open the DownloadPulse Desktop Agent on your PC or Mac and enter this temporary 6-digit pairing code:
              </Text>

              {/* Code Box */}
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{pairingCode}</Text>
                <View style={styles.timerRow}>
                  <Clock size={12} color="#D97706" />
                  <Text style={styles.timerText}>Expires in: {formatTime(timeLeft)}</Text>
                </View>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Desktop Agent Confirm Box */}
              <View style={styles.simBox}>
                <Text style={styles.simTitle}>Simulate Desktop Agent</Text>
                <TextInput
                  style={styles.simInput}
                  value={simulatedDeviceName}
                  onChangeText={setSimulatedDeviceName}
                  placeholder="Computer Name (e.g. Meets-PC)"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  onPress={handleSimulateAgentConfirm}
                  disabled={isConfirming || timeLeft <= 0}
                  style={styles.pairBtn}
                >
                  <Text style={styles.pairBtnText}>
                    {isConfirming ? 'Verifying Code...' : 'Confirm Pairing on Desktop Agent'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomRow}>
                <TouchableOpacity onPress={startPairingSession} style={styles.refreshCodeBtn}>
                  <RefreshCw size={12} color="#64748B" />
                  <Text style={styles.refreshCodeText}>Generate New Code</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
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
    maxWidth: 400,
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
  codeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  codeText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#000000',
    fontFamily: 'Platform'
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6
  },
  timerText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700'
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
    fontWeight: '600'
  },
  simBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 8
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A'
  },
  simInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A'
  },
  pairBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  pairBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  refreshCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  refreshCodeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
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
    textAlign: 'center'
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
