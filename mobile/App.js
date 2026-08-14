import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity as ActivityIcon,
  Laptop,
  Search,
  Filter,
  Plus,
  Bell,
  Trash2,
  Monitor
} from 'lucide-react-native';

import { ExpoHeader } from './src/components/ExpoHeader';
import { ExpoTabBar } from './src/components/ExpoTabBar';
import { ActivityCard } from './src/components/ActivityCard';
import { ActivityDetailModal } from './src/components/ActivityDetailModal';
import { PairingModal } from './src/components/PairingModal';
import { AuthModal } from './src/components/AuthModal';
import { SimulatorDrawer } from './src/components/SimulatorDrawer';

import {
  fetchActivities,
  fetchDevices,
  getUserAuthToken,
  setUserAuthToken,
  loginWithGoogle,
  unpairDevice
} from './src/services/api';
import { setupPushNotifications } from './src/services/pushNotificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');

  // Data States
  const [activities, setActivities] = useState([]);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({
    name: 'Meet Jobanputra',
    email: 'meetjabhanputra2112@gmail.com',
    userId: 'usr_hardcoded_user_001',
    provider: 'Hardcoded Default'
  });

  // UI Modal States
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSimulatorDrawer, setShowSimulatorDrawer] = useState(false);

  // Filtering & Search
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Settings Toggles
  const [notifyOnUsb, setNotifyOnUsb] = useState(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [notifyOnFail, setNotifyOnFail] = useState(true);

  // Auto Background Sync Every 3 Seconds
  const loadData = useCallback(async () => {
    try {
      const [actData, devData] = await Promise.all([
        fetchActivities({ type: filterType, status: filterStatus, q: searchQuery }),
        fetchDevices()
      ]);
      setActivities(actData);
      setDevices(devData);
    } catch (err) {
      console.warn('[Mobile App] Background sync error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterType, filterStatus, searchQuery]);

  useEffect(() => {
    async function initAuthAndLoad() {
      if (!getUserAuthToken()) {
        try {
          const u = await loginWithGoogle(null, {
            email: 'meetjabhanputra2112@gmail.com',
            name: 'Meet Jobanputra',
            id: 'usr_hardcoded_user_001'
          });
          setUser(u.user || u);
        } catch (e) {}
      }
      loadData();
    }
    initAuthAndLoad();

    setupPushNotifications(activityId => {
      const target = activities.find(a => a.activityId === activityId);
      if (target) {
        setSelectedActivity(target);
      }
    });

    // Seamless automatic background refresh every 3 seconds
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleUnpair = async (deviceId) => {
    await unpairDevice(deviceId);
    setDevices(prev => prev.filter(d => d.deviceId !== deviceId));
  };

  const handleLogout = () => {
    setUserAuthToken(null);
    setUser(null);
    setActivities([]);
    setDevices([]);
    setShowAuthModal(false);
  };

  const filteredActivities = activities.filter(act => {
    if (filterType !== 'ALL' && act.activityType !== filterType) return false;
    if (filterStatus !== 'ALL' && act.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFile = act.filename?.toLowerCase().includes(q);
      const matchExt = act.extension?.toLowerCase().includes(q);
      const matchDevice = act.device?.toLowerCase().includes(q) || act.deviceName?.toLowerCase().includes(q);
      const matchDest = act.destination?.toLowerCase().includes(q);
      if (!matchFile && !matchExt && !matchDevice && !matchDest) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* Main Header */}
        <ExpoHeader
          user={user}
          devices={devices}
          unreadCount={unreadCount}
          onOpenNotifications={() => setActiveTab('notifications')}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* TAB 1: LIVE ACTIVITY FEED */}
        {activeTab === 'feed' && (
          <View style={styles.screenContent}>
            <View style={styles.summaryBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTitle}>Live Activity Feed</Text>
                <Text style={styles.summarySubtitle}>
                  {devices.some(d => d.isOnline) ? (
                    <Text style={{ color: '#15803D', fontWeight: '700' }}>🟢 Computer Connected & Online</Text>
                  ) : (
                    <Text style={{ color: '#DC2626', fontWeight: '700' }}>🔴 Computer Disconnected (Server Offline)</Text>
                  )}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    loadData();
                    setShowPairingModal(true);
                  }
                }}
                style={[
                  styles.pairPcButton,
                  !devices.some(d => d.isOnline) && { backgroundColor: '#2563EB' }
                ]}
                activeOpacity={0.8}
              >
                <Plus size={14} color="#FFFFFF" />
                <Text style={styles.pairPcButtonText}>
                  {devices.some(d => d.isOnline) ? 'Pair PC' : 'Connect PC'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips Bar */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeaderRow}>
                <View style={styles.filterTitleRow}>
                  <Filter size={12} color="#64748B" />
                  <Text style={styles.filterTitle}>Filter Activity</Text>
                </View>
                <Text style={styles.filterCountText}>
                  Showing {filteredActivities.length} of {activities.length}
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {[
                  { id: 'ALL', label: 'All Types' },
                  { id: 'DOWNLOAD', label: 'Downloads' },
                  { id: 'USB_TRANSFER', label: 'USB Drives' },
                  { id: 'FILE_COPY', label: 'Local Copies' }
                ].map(chip => (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setFilterType(chip.id)}
                    style={[styles.chip, filterType === chip.id && styles.activeChip]}
                  >
                    <Text style={[styles.chipText, filterType === chip.id && styles.activeChipText]}>
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Activity List with Pull-to-Refresh */}
            <FlatList
              data={filteredActivities}
              keyExtractor={item => item.activityId || item._id || Math.random().toString()}
              renderItem={({ item }) => (
                <ActivityCard activity={item} onClick={() => setSelectedActivity(item)} />
              )}
              contentContainerStyle={styles.listPadding}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#000000" />
              }
              ListEmptyComponent={
                <View style={styles.emptyCard}>
                  <ActivityIcon size={24} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>
                    {!user ? 'Sign In Required' : devices.length === 0 ? 'No Computers Connected' : 'No Activity Found'}
                  </Text>
                  <Text style={styles.emptyDesc}>
                    {!user
                      ? 'Please sign in with Google to view your paired computers and file activity.'
                      : devices.length === 0
                      ? 'Pair your Windows or Mac computer with the 6-digit pairing code to start tracking file downloads.'
                      : 'No file activities match your selected filter criteria.'}
                  </Text>
                  {!user ? (
                    <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.resetFiltersBtn}>
                      <Text style={styles.resetFiltersText}>Sign In with Google</Text>
                    </TouchableOpacity>
                  ) : devices.length === 0 ? (
                    <TouchableOpacity onPress={() => setShowPairingModal(true)} style={styles.resetFiltersBtn}>
                      <Text style={styles.resetFiltersText}>Pair Computer (+ Add Code)</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              }
            />
          </View>
        )}

        {/* TAB 2: PAIRED COMPUTERS */}
        {activeTab === 'devices' && (
          <ScrollView style={styles.screenContent} contentContainerStyle={styles.listPadding}>
            <View style={styles.summaryBanner}>
              <View>
                <Text style={styles.summaryTitle}>Paired Computers</Text>
                <Text style={styles.summarySubtitle}>
                  Computers explicitly paired to your account
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (!user) setShowAuthModal(true);
                  else setShowPairingModal(true);
                }}
                style={styles.pairPcButton}
              >
                <Plus size={14} color="#FFFFFF" />
                <Text style={styles.pairPcButtonText}>Pair PC</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10, marginTop: 10 }}>
              {devices.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Laptop size={28} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>0 Computers Connected</Text>
                  <Text style={styles.emptyDesc}>
                    No desktop devices are paired to your account. Enter the 6-digit code displayed on your desktop agent to connect.
                  </Text>
                </View>
              ) : (
                devices.map(device => (
                  <View key={device.deviceId} style={styles.deviceCard}>
                    <View style={styles.deviceTopRow}>
                      <View style={styles.deviceInfoRow}>
                        <View style={styles.laptopIconBox}>
                          <Laptop size={20} color="#0F172A" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.deviceNameRow}>
                            <Text style={styles.cardDeviceName} numberOfLines={1} ellipsizeMode="tail">
                              {device.name || device.deviceName}
                            </Text>
                            <View
                              style={[
                                styles.onlinePill,
                                device.isOnline ? styles.onlinePillGreen : styles.onlinePillRed
                              ]}
                            >
                              <Text
                                style={[
                                  styles.onlinePillText,
                                  { color: device.isOnline ? '#15803D' : '#B91C1C' }
                                ]}
                              >
                                {device.isOnline ? 'Online' : 'Offline'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.osText}>
                            {(device.os || device.platform || 'windows').toUpperCase()} • v{device.agentVersion || '1.0.0'}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleUnpair(device.deviceId)}
                        style={styles.unpairBtn}
                      >
                        <Trash2 size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>

                    {/* Compact Card Bottom Box (Fixed overflow layout) */}
                    <View style={styles.deviceBottomRow}>
                      <Text style={styles.lastSeenText} numberOfLines={1}>
                        Active: {new Date(device.lastHeartbeat || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={styles.deviceIdText} numberOfLines={1} ellipsizeMode="middle">
                        ID: {device.deviceId ? device.deviceId.replace('dev_', '') : ''}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {/* TAB 3: SEARCH */}
        {activeTab === 'search' && (
          <View style={styles.screenContent}>
            <View style={styles.searchBanner}>
              <Text style={styles.summaryTitle}>Search Activity Records</Text>
              <View style={styles.searchBar}>
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search by filename, extension (.zip, .mp4)..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <FlatList
              data={filteredActivities}
              keyExtractor={item => item.activityId || item._id || Math.random().toString()}
              renderItem={({ item }) => (
                <ActivityCard activity={item} onClick={() => setSelectedActivity(item)} />
              )}
              contentContainerStyle={styles.listPadding}
              ListEmptyComponent={
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyDesc}>No matching file records found.</Text>
                </View>
              }
            />
          </View>
        )}

        {/* TAB 4: ALERTS */}
        {activeTab === 'notifications' && (
          <ScrollView style={styles.screenContent} contentContainerStyle={styles.listPadding}>
            <View style={styles.summaryBanner}>
              <View>
                <Text style={styles.summaryTitle}>Mobile Push Alerts</Text>
                <Text style={styles.summarySubtitle}>Expo Push Notification delivery history</Text>
              </View>
            </View>

            <View style={{ gap: 10, marginTop: 10 }}>
              {notifications.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyDesc}>No push alerts received yet.</Text>
                </View>
              ) : (
                notifications.map(notif => (
                  <View key={notif.id} style={styles.notifCard}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifIconBox}>
                        <Bell size={16} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifTitle}>{notif.title}</Text>
                        <Text style={styles.notifBody}>{notif.body}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <ScrollView style={styles.screenContent} contentContainerStyle={styles.listPadding}>
            <View style={styles.settingsCard}>
              <View style={styles.profileRow}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>{user ? user.name?.charAt(0) : 'A'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>{user?.name || 'Sign In Required'}</Text>
                  <Text style={styles.profileEmail}>{user?.email || 'user@downloadpulse.io'}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.accountBtn}>
                  <Text style={styles.accountBtnText}>{user ? 'Account' : 'Sign In'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>MOBILE PUSH PREFERENCES</Text>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>USB Drive Transfers</Text>
                  <Text style={styles.toggleDesc}>Alert when USB storage device is mounted</Text>
                </View>
                <Switch value={notifyOnUsb} onValueChange={setNotifyOnUsb} trackColor={{ true: '#000000' }} />
              </View>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Transfer Completion</Text>
                  <Text style={styles.toggleDesc}>Alert on successful download or copy</Text>
                </View>
                <Switch value={notifyOnComplete} onValueChange={setNotifyOnComplete} trackColor={{ true: '#000000' }} />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowSimulatorDrawer(!showSimulatorDrawer)}
              style={styles.openSimulatorBtn}
            >
              <Monitor size={16} color="#FFFFFF" />
              <Text style={styles.openSimulatorText}>Toggle Event Simulator</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Desktop Event Simulator Overlay */}
        <SimulatorDrawer
          visible={showSimulatorDrawer}
          onClose={() => setShowSimulatorDrawer(false)}
          onSimulatedEvent={newAct => {
            if (newAct) setActivities(prev => [newAct, ...prev]);
          }}
        />

        {/* Bottom Navigation Bar */}
        <ExpoTabBar activeTab={activeTab} onChangeTab={setActiveTab} unreadCount={unreadCount} />

        {/* Detail Modal */}
        {selectedActivity && (
          <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
        )}

        {/* Pairing Modal */}
        <PairingModal
          visible={showPairingModal}
          onClose={() => setShowPairingModal(false)}
          onDevicePaired={dev => {
            if (dev) setDevices(prev => [...prev, dev]);
          }}
        />

        {/* Auth Modal */}
        <AuthModal
          visible={showAuthModal}
          user={user}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={u => {
            setUser(u);
            loadData();
          }}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  screenContent: {
    flex: 1
  },
  listPadding: {
    padding: 14,
    paddingBottom: 24
  },
  summaryBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  summarySubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  summaryHighlight: {
    color: '#000000',
    fontWeight: '700'
  },
  pairPcButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pairPcButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  filterSection: {
    marginHorizontal: 14,
    marginBottom: 10,
    gap: 6
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  filterCountText: {
    fontSize: 10,
    color: '#94A3B8'
  },
  chipsScroll: {
    flexDirection: 'row'
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6
  },
  activeChip: {
    backgroundColor: '#000000',
    borderColor: '#000000'
  },
  chipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B'
  },
  emptyDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16
  },
  resetFiltersBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6
  },
  resetFiltersText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 10
  },
  deviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  laptopIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cardDeviceName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    maxWidth: 140
  },
  onlinePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1
  },
  onlinePillGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7'
  },
  onlinePillRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2'
  },
  onlinePillText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  osText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  unpairBtn: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  deviceBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8
  },
  lastSeenText: {
    fontSize: 10,
    color: '#64748B',
    flex: 1
  },
  deviceIdText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    maxWidth: '45%'
  },
  searchBanner: {
    padding: 14,
    gap: 10
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A'
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'start',
    gap: 10
  },
  notifIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  notifBody: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    gap: 10
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  profileEmail: {
    fontSize: 11,
    color: '#64748B'
  },
  accountBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  accountBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B'
  },
  settingsSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  toggleDesc: {
    fontSize: 10,
    color: '#64748B'
  },
  openSimulatorBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6
  },
  openSimulatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  }
});
