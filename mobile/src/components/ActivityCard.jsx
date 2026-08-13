import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react-native';

export function ActivityCard({ activity, onClick }) {
  if (!activity) return null;

  const ext = activity.extension?.toLowerCase() || '';

  const getFileIcon = () => {
    if (activity.activityType === 'USB_TRANSFER') {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#FAF5FF' }]}>
          <Text style={[styles.iconText, { color: '#7E22CE' }]}>USB</Text>
        </View>
      );
    }
    if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.iconText, { color: '#2563EB' }]}>MP4</Text>
        </View>
      );
    }
    if (['zip', 'tar', 'gz', '7z', 'rar', 'iso'].includes(ext)) {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
          <Text style={[styles.iconText, { color: '#EA580C' }]}>
            {ext ? ext.toUpperCase() : 'ZIP'}
          </Text>
        </View>
      );
    }
    if (['parquet', 'csv', 'xlsx', 'json'].includes(ext)) {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.iconText, { color: '#059669' }]}>DATA</Text>
        </View>
      );
    }
    if (['js', 'ts', 'py', 'rs', 'cpp', 'java', 'html'].includes(ext)) {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
          <Text style={[styles.iconText, { color: '#4F46E5' }]}>CODE</Text>
        </View>
      );
    }
    return (
      <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
        <Text style={[styles.iconText, { color: '#334155' }]}>FILE</Text>
      </View>
    );
  };

  const isError = activity.status === 'FAILED' || activity.status === 'CANCELLED';

  const renderStatusBadge = () => {
    switch (activity.status) {
      case 'COMPLETED':
        return (
          <View style={[styles.badge, styles.completedBadge]}>
            <CheckCircle2 size={10} color="#166534" />
            <Text style={[styles.badgeLabel, { color: '#166534' }]}>Completed</Text>
          </View>
        );
      case 'IN_PROGRESS':
        return (
          <View style={[styles.badge, styles.progressBadge]}>
            <Text style={[styles.badgeLabel, { color: '#1D4ED8' }]}>
              {activity.progress !== undefined ? `${activity.progress}%` : 'Transferring'}
            </Text>
          </View>
        );
      case 'FAILED':
      case 'CANCELLED':
        return (
          <View style={[styles.badge, styles.failedBadge]}>
            <XCircle size={10} color="#FFFFFF" />
            <Text style={[styles.badgeLabel, { color: '#FFFFFF' }]}>
              {activity.status === 'CANCELLED' ? 'Cancelled' : 'Failed'}
            </Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, styles.startedBadge]}>
            <Clock size={10} color="#B45309" />
            <Text style={[styles.badgeLabel, { color: '#B45309' }]}>{activity.status}</Text>
          </View>
        );
    }
  };

  const formattedTime = new Date(activity.timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      style={[styles.card, isError && styles.errorCard]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftContent}>
          {getFileIcon()}
          <View style={styles.textWrapper}>
            <Text style={[styles.filename, isError && styles.errorFilename]} numberOfLines={1}>
              {activity.filename}
            </Text>
            <Text style={[styles.subtext, isError && styles.errorSubtext]} numberOfLines={1}>
              {activity.activityType === 'USB_TRANSFER'
                ? `${activity.sourceDrive || 'E:'} USB Drive → ${activity.destinationDrive || 'C:'} ${activity.deviceName || 'PC'} • ${activity.fileSize || '0 B'}`
                : `${activity.destination || 'Downloads'} • ${activity.fileSize || '0 B'}`}
            </Text>
          </View>
        </View>

        <View style={styles.rightBadgeWrapper}>
          {renderStatusBadge()}
          <Text style={[styles.timeText, isError && styles.errorTimeText]}>
            {formattedTime}
          </Text>
        </View>
      </View>

      {/* In Progress Bar */}
      {activity.status === 'IN_PROGRESS' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressSubtext}>Transferring...</Text>
            <Text style={styles.speedText}>{activity.downloadSpeed || '24.2 MB/s'}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(activity.progress || 25, 100)}%` }
              ]}
            />
          </View>
        </View>
      )}

      {/* Failure Reason */}
      {activity.reason && (
        <View style={styles.reasonRow}>
          <AlertTriangle size={12} color="#EF4444" />
          <Text style={styles.reasonText} numberOfLines={1}>
            Reason: {activity.reason}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 10,
    fontWeight: '800'
  },
  textWrapper: {
    flex: 1
  },
  filename: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  errorFilename: {
    color: '#7F1D1D'
  },
  subtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  errorSubtext: {
    color: '#991B1B'
  },
  rightBadgeWrapper: {
    alignItems: 'flex-end',
    gap: 4
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1
  },
  completedBadge: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7'
  },
  progressBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE'
  },
  failedBadge: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C'
  },
  startedBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7'
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  timeText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '500'
  },
  errorTimeText: {
    color: '#F87171'
  },
  progressContainer: {
    marginTop: 10,
    gap: 4
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  progressSubtext: {
    fontSize: 10,
    color: '#64748B'
  },
  speedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB'
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8
  },
  reasonText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1
  }
});
