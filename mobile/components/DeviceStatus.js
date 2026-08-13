import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeviceStatus({ devices = [] }) {
  const primaryDevice = devices.find(d => d.platform !== 'mobile') || devices[0];

  const isOnline = primaryDevice ? primaryDevice.isOnline : false;
  const name = primaryDevice ? primaryDevice.name : 'Windows PC';

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.deviceLabel}>Monitored Device</Text>
        <Text style={styles.deviceName}>🖥️ {name}</Text>
      </View>
      <View style={[styles.badge, isOnline ? styles.onlineBadge : styles.offlineBadge]}>
        <Text style={styles.badgeDot}>{isOnline ? '🟢' : '🔴'}</Text>
        <Text style={[styles.badgeText, isOnline ? styles.onlineText : styles.offlineText]}>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  deviceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500'
  },
  deviceName: {
    fontSize: 15,
    color: '#F8FAFC',
    fontWeight: '700',
    marginTop: 2
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  onlineBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
    borderWidth: 1
  },
  offlineBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1
  },
  badgeDot: {
    fontSize: 8,
    marginRight: 4
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  onlineText: {
    color: '#4ADE80'
  },
  offlineText: {
    color: '#F87171'
  }
});
