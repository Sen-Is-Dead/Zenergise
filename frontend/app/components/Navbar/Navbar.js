import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './Navbar.Styles';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={[styles.navItem, styles.firstNavItem]}>
        <Image source={require('../../assets/icons/nutrition-icon.png')} style={styles.icon} />
        <Text>Nutrition</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Image source={require('../../assets/icons/home-workout-icon.png')} style={styles.icon} />
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.navItem, styles.lastNavItem]}>
        <Image source={require('../../assets/icons/profile-icon.png')} style={styles.icon} />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;