import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Monitor, X } from 'lucide-react-native';
import { triggerSimulatedActivity } from '../services/api';

export function SimulatorDrawer({ visible, onClose, onSimulatedEvent }) {
  const [simFilename, setSimFilename] = useState('ubuntu-24.04-desktop-amd64.iso');
  const [simType, setSimType] = useState('DOWNLOAD');
  const [simSize, setSimSize] = useState('4.8 GB');

  if (!visible) return null;

  const handleTrigger = async status => {
    const newAct = await triggerSimulatedActivity({
      filename: simFilename,
      activityType: simType,
      fileSize: simSize,
      status,
      reason: status === 'FAILED' ? 'Network Connection Reset by Peer' : undefined,
      sourceDrive: simType === 'USB_TRANSFER' ? 'E:' : undefined,
      destinationDrive: 'C:'
    });
    if (onSimulatedEvent) onSimulatedEvent(newAct);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Monitor size={16} color="#000000" />
          <Text style={styles.title}>Desktop Agent Event Simulator</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.desc}>
        Instantly trigger file events from the simulated Desktop Agent to test real-time mobile retrieval and push notifications.
      </Text>

      <View style={styles.inputsRow}>
        <View style={styles.field}>
          <Text style={styles.label}>FILENAME</Text>
          <TextInput
            style={styles.input}
            value={simFilename}
            onChangeText={setSimFilename}
            placeholder="Filename"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>FILE SIZE</Text>
          <TextInput
            style={styles.input}
            value={simSize}
            onChangeText={setSimSize}
            placeholder="File Size"
          />
        </View>
      </View>

      <View style={styles.typeSelectorRow}>
        {['DOWNLOAD', 'USB_TRANSFER', 'FILE_COPY'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setSimType(type)}
            style={[styles.typeChip, simType === type && styles.activeTypeChip]}
          >
            <Text style={[styles.typeText, simType === type && styles.activeTypeText]}>
              {type.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => handleTrigger('COMPLETED')}
          style={styles.triggerCompleteBtn}
        >
          <Text style={styles.completeBtnText}>Trigger Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTrigger('FAILED')}
          style={styles.triggerFailBtn}
        >
          <Text style={styles.failBtnText}>Trigger Failure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#0F172A',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  closeBtn: {
    padding: 4
  },
  desc: {
    fontSize: 11,
    color: '#64748B'
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 10
  },
  field: {
    flex: 1,
    gap: 2
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B'
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    color: '#0F172A'
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6
  },
  typeChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  activeTypeChip: {
    backgroundColor: '#000000',
    borderColor: '#000000'
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569'
  },
  activeTypeText: {
    color: '#FFFFFF'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  triggerCompleteBtn: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  triggerFailBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  failBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  }
});
