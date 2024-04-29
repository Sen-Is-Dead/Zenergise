import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
    textAlign: 'right',
    paddingTop: 8,
    paddingBottom: 8,
  },
  textInfo: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
    textAlign: 'left',
    paddingTop: 8,
    paddingBottom: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 5,
    width: '100%',
  },
  label: {
    fontSize: 17,
    color: '#333333',
    width: '40%',
    textAlign: 'right',
    paddingRight: 10,
  },
  input: {
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8,
    borderRadius: 5,
    width: '55%',
  },
  dropView:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '55%',
    zIndex: 1000,
    paddingTop: 15,
    paddingBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    width: '100%',
    height: 20,
  },
  dropdownoptions: {
    borderColor: '#cccccc',
    color: '#333333',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
    zIndex: -1000,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default styles;
