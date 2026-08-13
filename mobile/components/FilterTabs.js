import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const tabs = [
  { id: 'ALL', label: 'All Activity' },
  { id: 'DOWNLOAD', label: 'Downloads ⬇️' },
  { id: 'FILE_COPY', label: 'File Copies 📁' },
  { id: 'FAILED', label: 'Failed ❌', isStatus: true }
];

export default function FilterTabs({ activeFilter, onSelectFilter }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSelectFilter(tab.id, tab.isStatus)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  scrollContent: {
    paddingHorizontal: 16
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA'
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8'
  },
  activeTabText: {
    color: '#FFFFFF'
  }
});
