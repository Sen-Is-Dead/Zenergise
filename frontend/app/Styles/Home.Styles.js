// Home.Styles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  workoutContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  workoutHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#a9a9a9',
    marginBottom: 10,
  },
  exercise: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 15,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    backgroundColor: '#fff0f0',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcccc',
    marginHorizontal: 20,
    marginTop: 20,
  },
  
});

export default styles;