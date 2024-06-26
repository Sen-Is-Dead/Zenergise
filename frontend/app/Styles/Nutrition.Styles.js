import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 10,
  },
  boldText: {
    fontWeight: 'bold',
    flex: 1, // ensures it takes the space it needs
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  dailyTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dailyTotalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  nutritionInfo: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
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