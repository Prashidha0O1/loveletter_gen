import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingScreen from '../../components/ui/LoadingScreen';
import LoveLetterGenerator from '../../components/ui/LoveLetterGenerator';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen /> : <LoveLetterGenerator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;