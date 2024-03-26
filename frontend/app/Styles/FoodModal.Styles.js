import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 8,
    paddingLeft: 10,
    flex: 1,
    marginRight: 10,
    height: 40,
    minWidth: '50%',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    height: 40,
    minHeight: 40,
    maxWidth: '50%',
  },
  dropDownContainer: {
    width: '50%',
  },
  nutrientText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 'auto',
    bottom: 20,
    color: 'green',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;