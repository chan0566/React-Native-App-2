import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from './components/ActionButton';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Random User Generator</Text>
        <ActionButton />
        <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
