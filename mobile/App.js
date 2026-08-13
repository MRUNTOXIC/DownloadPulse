import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import DeviceStatus from './components/DeviceStatus';
import FilterTabs from './components/FilterTabs';
import ActivityCard from './components/ActivityCard';
import { fetchActivities, fetchDevices } from './services/api';
import { setupPushNotifications } from './services/pushNotificationService';

export default function App() {
  const [activities, setActivities] = useState([]);
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const isStatusFilter = filter === 'FAILED';
    const filterOptions = {
      type: isStatusFilter ? 'ALL' : filter,
      status: isStatusFilter ? 'FAILED' : 'ALL',
      q: searchQuery
    };

    const [activitiesData, devicesData] = await Promise.all([
      fetchActivities(filterOptions),
      fetchDevices()
    ]);

    setActivities(activitiesData);
    setDevices(devicesData);
  }, [filter, searchQuery]);

  useEffect(() => {
    loadData();
    setupPushNotifications();

    // Auto-refresh activity feed every 4 seconds for live activity tracking
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>DownloadPulse ⚡</Text>
          <Text style={styles.headerSubtitle}>Windows File Activity Monitor</Text>
        </View>
      </View>

      {/* Device Status Bar */}
      <DeviceStatus devices={devices} />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search filename..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Activity Filter Tabs */}
      <FilterTabs activeFilter={filter} onSelectFilter={(newFilter) => setFilter(newFilter)} />

      {/* Activity Feed List */}
      <FlatList
        data={activities}
        keyExtractor={(item) => item.activityId || item._id || Math.random().toString()}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" colors={['#38BDF8']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyText}>No file activities detected yet.</Text>
            <Text style={styles.emptySubtext}>Download files or copy to your Windows PC to view live events.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500'
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 10
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155'
  },
  listContent: {
    paddingBottom: 20
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 30
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700'
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6
  }
});
