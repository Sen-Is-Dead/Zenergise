import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DDDDDD',
    padding: 0,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navItemActive: {
    backgroundColor: '#e0e0e0',
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  firstNavItem: {
    borderLeftWidth: 0,
  },
  lastNavItem: {
    borderRightWidth: 0,
  },
});

export default styles;
