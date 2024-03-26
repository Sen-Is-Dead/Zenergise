import { Tabs, useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default () => {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    height: 100,
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
            }}
        >
            <Tabs.Screen
                name="nutrition"
                options={{
                    tabBarLabel: 'Nutrition',
                    headerTitle: 'Nutrition',
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/icons/nutrition-icon.png')}
                            style={{ width: 25, height: 25, marginTop: 10 }}
                        />)
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: 'Home',
                    headerTitle: 'Home Screen',
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/icons/home-workout-icon.png')}
                            style={{ width: 25, height: 25, marginTop: 10 }}
                        />)
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: 'Account',
                    headerTitle: 'My Account',
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/icons/profile-icon.png')}
                            style={{ width: 25, height: 25, marginTop: 10 }}
                        />
                    )
                }}
            />
        </Tabs>
    );
};

