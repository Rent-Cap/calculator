import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const MyDocument = ({tenant, landlord, refund}) => {
  const currentDate = new Date().toDateString();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Dear {landlord || '________________'},</Text>
          <Text>According to (bill name) my rent is higher than laws allow. I am owed a refund of ${refund}.</Text>
          <Text>Thank you,</Text>
          <Text>{tenant || '________________'}</Text>
          <Text>{currentDate}</Text>
        </View>
      </Page>
    </Document>
  )
};
export default MyDocument;