import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Laptop, Bell, User } from 'lucide-react-native';

export function ExpoHeader({
  user,
  devices = [],
  unreadCount = 0,
  onOpenNotifications,
  onOpenAuth
}) {
  const activeDevice = devices.find(d => d.isOnline) || devices[0];

  return (
    <View style={styles.container}>
      {/* Brand & Device Chip */}
      <View style={styles.brandContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.brandTitle}>DownloadPulse</Text>
          <View style={styles.greenPulseDot} />
        </View>

        {activeDevice ? (
          <View style={styles.deviceRow}>
            <Laptop size={12} color="#94A3B8" />
            <Text style={styles.deviceName}>{activeDevice.name || activeDevice.deviceName}</Text>
            <View
              style={[
                styles.statusBadge,
                activeDevice.isOnline ? styles.onlineBadge : styles.offlineBadge
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: activeDevice.isOnline ? '#22C55E' : '#EF4444' }
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: activeDevice.isOnline ? '#15803D' : '#B91C1C' }
                ]}
              >
                {activeDevice.isOnline ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDeviceText}>No Computer Paired</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={onOpenNotifications}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Bell size={16} color="#334155" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenAuth} style={styles.userButton} activeOpacity={0.7}>
          <View style={styles.userAvatar}>
            {user ? (
              <Text style={styles.avatarText}>{user.name ? user.name.charAt(0) : 'U'}</Text>
            ) : (
              <User size={14} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandContainer: {
    flexDirection: 'column'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E'
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  deviceName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 99,
    borderWidth: 1
  },
  onlineBadge: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7'
  },
  offlineBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2'
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800'
  },
  noDeviceText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  userButton: {
    padding: 2
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
