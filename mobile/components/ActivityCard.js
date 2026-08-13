import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivityCard({ activity }) {
  const {
    activityType = 'DOWNLOAD',
    status = 'COMPLETED',
    filename,
    fileSize = '0 B',
    sourceDrive,
    destinationDrive,
    timestamp,
    reason
  } = activity;

  function getStatusStyle() {
    switch (status) {
      case 'COMPLETED':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: '#22C55E', text: '#4ADE80', label: 'COMPLETED' };
      case 'IN_PROGRESS':
      case 'STARTED':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3B82F6', text: '#60A5FA', label: 'IN PROGRESS' };
      case 'STALLED':
        return { bg: 'rgba(234, 179, 8, 0.15)', border: '#EAB308', text: '#FACC15', label: 'STALLED' };
      case 'FAILED':
      case 'CANCELLED':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#F87171', label: status };
      default:
        return { bg: '#334155', border: '#64748B', text: '#94A3B8', label: status };
    }
  }

  function getTypeIcon() {
    switch (activityType) {
      case 'FILE_COPY':
      case 'FILE_MOVE':
        return '📁';
      case 'DOWNLOAD':
        return '⬇️';
      case 'FILE_EXTRACT':
        return '📦';
      default:
        return '📄';
    }
  }

  const statusStyle = getStatusStyle();
  const timeFormatted = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
          <Text style={styles.filename} numberOfLines={1}>
            {filename}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.sizeText}>Size: {fileSize}</Text>
        <Text style={styles.timeText}>{timeFormatted}</Text>
      </View>

      {(activityType === 'FILE_COPY' || sourceDrive || destinationDrive) && (
        <View style={styles.driveRow}>
          <Text style={styles.driveText}>
            Transfer: {sourceDrive ? `Drive (${sourceDrive})` : 'USB/Source'} → {destinationDrive ? `Drive (${destinationDrive})` : 'Windows PC'}
          </Text>
        </View>
      )}

      {reason && (
        <View style={styles.reasonRow}>
          <Text style={styles.reasonText}>Reason: {reason}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  typeIcon: {
    fontSize: 18,
    marginRight: 8
  },
  filename: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  sizeText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600'
  },
  timeText: {
    fontSize: 12,
    color: '#64748B'
  },
  driveRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155'
  },
  driveText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '500'
  },
  reasonRow: {
    marginTop: 4
  },
  reasonText: {
    fontSize: 12,
    color: '#F87171',
    fontStyle: 'italic'
  }
});
