import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import MapScreen from './src/screens/MapScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MapScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // On Android, SafeAreaView needs padding to avoid status bar overlap
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
