import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X, Copy, Check, HardDrive, Clock, Laptop, ShieldCheck, AlertTriangle, Folder, Download } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export function ActivityDetailModal({ activity, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const handleCopyPath = async () => {
    if (activity.destination) {
      await Clipboard.setStringAsync(activity.destination);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedStarted = new Date(activity.startedAt || activity.timestamp || Date.now()).toLocaleString();
  const formattedCompleted = activity.completedAt
    ? new Date(activity.completedAt).toLocaleString()
    : (activity.status === 'COMPLETED' ? formattedStarted : 'In Progress...');

  return (
    <Modal visible={!!activity} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {(activity.activityType || 'DOWNLOAD').replace('_', ' ')}
                </Text>
              </View>
              <Text style={styles.idText}>ID: {activity.activityId}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title & Format */}
            <View style={styles.titleSection}>
              <Text style={styles.filename}>{activity.filename}</Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.fileSizeText}>{activity.fileSize || '0 B'}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.formatText}>
                  {(activity.extension || 'FILE').toUpperCase()} Format
                </Text>
              </View>
            </View>

            {/* Status Highlight Banner */}
            <View
              style={[
                styles.statusBanner,
                activity.status === 'COMPLETED'
                  ? styles.completedBanner
                  : activity.status === 'FAILED' || activity.status === 'CANCELLED'
                  ? styles.failedBanner
                  : styles.progressBanner
              ]}
            >
              <View style={styles.bannerTextCol}>
                <Text
                  style={[
                    styles.bannerStatusTitle,
                    {
                      color:
                        activity.status === 'COMPLETED'
                          ? '#14532D'
                          : activity.status === 'FAILED'
                          ? '#7F1D1D'
                          : '#1E3A8A'
                    }
                  ]}
                >
                  Status: {activity.status}
                </Text>
                <Text style={styles.bannerDesc}>
                  {activity.status === 'COMPLETED'
                    ? 'File activity verified & completed by Desktop Agent.'
                    : activity.status === 'FAILED' || activity.status === 'CANCELLED'
                    ? `Activity terminated: ${activity.reason || 'Cancelled by user'}`
                    : 'Active background transfer monitored in real-time.'}
                </Text>
              </View>

              {activity.status === 'COMPLETED' ? (
                <ShieldCheck size={24} color="#166534" />
              ) : activity.status === 'FAILED' ? (
                <AlertTriangle size={24} color="#DC2626" />
              ) : (
                <Download size={24} color="#2563EB" />
              )}
            </View>

            {/* Destination Filepath */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeaderRow}>
                <View style={styles.iconTitleRow}>
                  <Folder size={14} color="#000000" />
                  <Text style={styles.detailCardTitle}>DESTINATION FILEPATH</Text>
                </View>

                <TouchableOpacity onPress={handleCopyPath} style={styles.copyButton}>
                  {copied ? <Check size={12} color="#166534" /> : <Copy size={12} color="#000000" />}
                  <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy Path'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pathBox}>
                <Text style={styles.pathText} selectable>
                  {activity.destination || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Target Drive & Desktop Device */}
            <View style={styles.gridRow}>
              <View style={[styles.detailCard, { flex: 1 }]}>
                <Text style={styles.detailCardTitle}>TARGET DRIVE</Text>
                <View style={styles.iconValueRow}>
                  <HardDrive size={14} color="#000000" />
                  <Text style={styles.detailValue}>
                    {activity.destinationDrive || 'C:'} Drive
                  </Text>
                </View>
              </View>

              <View style={[styles.detailCard, { flex: 1 }]}>
                <Text style={styles.detailCardTitle}>DESKTOP DEVICE</Text>
                <View style={styles.iconValueRow}>
                  <Laptop size={14} color="#000000" />
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {activity.deviceName || activity.device || 'Windows PC'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Timestamps */}
            <View style={styles.detailCard}>
              <View style={styles.timeRow}>
                <View style={styles.iconTitleRow}>
                  <Clock size={12} color="#64748B" />
                  <Text style={styles.timeLabel}>Started At:</Text>
                </View>
                <Text style={styles.timeVal}>{formattedStarted}</Text>
              </View>

              <View style={[styles.timeRow, { marginTop: 6 }]}>
                <View style={styles.iconTitleRow}>
                  <Clock size={12} color="#64748B" />
                  <Text style={styles.timeLabel}>Completed At:</Text>
                </View>
                <Text style={styles.timeVal}>{formattedCompleted}</Text>
              </View>
            </View>

            {/* Lifecycle Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.timelineTitle}>SYSTEM LIFECYCLE TRACE</Text>
              <View style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>1</Text>
                </View>
                <Text style={styles.stepText}>Desktop Agent detected filesystem activity</Text>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Cloud API logged activity state ({activity.status})
                </Text>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.stepRow}>
                <View style={[styles.stepCircle, { backgroundColor: '#000000' }]}>
                  <Text style={[styles.stepNum, { color: '#FFFFFF' }]}>3</Text>
                </View>
                <Text style={styles.stepText}>Expo Mobile App received push update</Text>
              </View>
            </View>
          </ScrollView>

          {/* Close Action */}
          <TouchableOpacity onPress={onClose} style={styles.closeActionButton}>
            <Text style={styles.closeActionText}>Close Detail View</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase'
  },
  idText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Platform'
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    marginVertical: 12
  },
  titleSection: {
    marginBottom: 12
  },
  filename: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  fileSizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  dot: {
    color: '#94A3B8'
  },
  formatText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  statusBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  completedBanner: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  failedBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  progressBanner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE'
  },
  bannerTextCol: {
    flex: 1,
    marginRight: 10
  },
  bannerStatusTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  bannerDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2
  },
  detailCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  detailCardTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B'
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  copyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000'
  },
  pathBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10
  },
  pathText: {
    fontSize: 11,
    color: '#1E293B',
    fontFamily: 'Platform'
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10
  },
  iconValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },
  timeVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A'
  },
  timelineSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A'
  },
  stepText: {
    fontSize: 11,
    color: '#334155'
  },
  stepLine: {
    width: 1.5,
    height: 12,
    backgroundColor: '#E2E8F0',
    marginLeft: 9,
    marginVertical: 2
  },
  closeActionButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8
  },
  closeActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
