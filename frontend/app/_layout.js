import { Stack, useRouter } from 'expo-router'
import { Button } from 'react-native';

const Layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Login",
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Register"
                options={{
                    headerTitle: "Register",
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="addFoodModal"
                options={{
                    headerTitle: "Add Food",
                    presentation: 'modal',
                    headerRight: () => (
                        <Button
                            title="Close"
                            onPress={() => {
                                router.back();
                            }}
                        />
                    )
                }}
            />
        </Stack>
    )
}

export default Layout;