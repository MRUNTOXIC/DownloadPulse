import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Activity, Laptop, Search, Bell, Settings } from 'lucide-react-native';

export function ExpoTabBar({ activeTab, onChangeTab, unreadCount = 0 }) {
  const tabs = [
    { id: 'feed', label: 'Activities', icon: Activity },
    { id: 'devices', label: 'Devices', icon: Laptop },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Icon size={20} color={isActive ? '#000000' : '#94A3B8'} />
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge > 9 ? '9+' : tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4
  },
  iconWrapper: {
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -6,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800'
  },
  tabLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '500'
  },
  activeTabLabel: {
    color: '#000000',
    fontWeight: '800'
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#000000'
  }
});
