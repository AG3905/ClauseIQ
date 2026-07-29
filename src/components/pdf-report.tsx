import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { AnalysisResult } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#8C6721',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#8C6721',
  },
  subtitle: {
    fontSize: 8,
    color: '#666666',
    marginTop: 2,
  },
  verdictContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FBF8F3',
    borderColor: '#E6CFAB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  verdictLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#8C6721',
  },
  verdictReason: {
    fontSize: 8.5,
    color: '#444444',
    marginTop: 3,
    lineHeight: 1.3,
  },
  riskScoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E6CFAB',
  },
  riskScoreNumber: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#8C6721',
  },
  riskScoreSubText: {
    fontSize: 7.5,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A',
    marginTop: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 3,
  },
  summaryText: {
    fontSize: 9,
    fontStyle: 'italic',
    lineHeight: 1.4,
    backgroundColor: '#FAFAFA',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  clauseCard: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  clauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clauseTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#222222',
  },
  riskBadge: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#8C6721',
  },
  originalText: {
    fontSize: 8.5,
    color: '#444444',
    backgroundColor: '#F5F5F5',
    padding: 5,
    borderRadius: 3,
    marginBottom: 3,
    lineHeight: 1.3,
  },
  rewriteText: {
    fontSize: 8.5,
    color: '#154027',
    backgroundColor: '#EDF4EF',
    padding: 5,
    borderRadius: 3,
    marginBottom: 3,
    lineHeight: 1.3,
  },
  redFlagCard: {
    padding: 7,
    borderLeftWidth: 3,
    borderLeftColor: '#E87A7A',
    backgroundColor: '#FCF0F0',
    marginBottom: 5,
    borderRadius: 3,
  },
  redFlagTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#6B1D1D',
  },
  redFlagDesc: {
    fontSize: 8.5,
    color: '#444444',
    marginTop: 2,
    lineHeight: 1.3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#888888',
  },
});

interface PdfProps {
  documentName: string;
  result: AnalysisResult;
}

export const ContractAuditPdfDocument: React.FC<PdfProps> = ({ documentName, result }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ClauseIQ Audit Brief</Text>
          <Text style={styles.subtitle}>Document: {documentName} • Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Verdict & Exposure Score */}
      <View style={styles.verdictContainer}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.verdictLabel}>{result.verdictLabel || result.verdict}</Text>
          <Text style={styles.verdictReason}>{result.verdictReason}</Text>
        </View>
        <View style={styles.riskScoreBox}>
          <Text style={styles.riskScoreNumber}>{result.riskScore}/100</Text>
          <Text style={styles.riskScoreSubText}>Risk Exposure</Text>
        </View>
      </View>

      {/* Executive Summary */}
      {result.summary && (
        <View>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.summaryText}>"{result.summary}"</Text>
        </View>
      )}

      {/* Red Flags */}
      {result.redFlags && result.redFlags.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>High Exposure Red Flags ({result.redFlags.length})</Text>
          {result.redFlags.map((rf, idx) => (
            <View key={idx} style={styles.redFlagCard}>
              <Text style={styles.redFlagTitle}>[{rf.severity?.toUpperCase()}] {rf.title} ({rf.clause})</Text>
              <Text style={styles.redFlagDesc}>{rf.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Clauses Breakdown */}
      {result.clauses && result.clauses.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Clause Breakdown & Redlines</Text>
          {result.clauses.map((clause, idx) => (
            <View key={idx} style={styles.clauseCard} wrap={false}>
              <View style={styles.clauseHeader}>
                <Text style={styles.clauseTitle}>{clause.title}</Text>
                <Text style={styles.riskBadge}>[{clause.riskLevel} risk]</Text>
              </View>
              <Text style={styles.originalText}>Original: "{clause.originalText}"</Text>
              {clause.rewriteOption && (
                <Text style={styles.rewriteText}>Proposed Rewrite: "{clause.rewriteOption}"</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>ClauseIQ Legal Audit Report</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);
