import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Link, useRouter } from "expo-router";
import axios from 'axios';
import styles from './Styles/Styling';

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://192.168.0.29:8000/api/user', { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    router.replace('home');
                }
            })
            .catch(error => {
                console.log('Error fetching user', error);
            });
    }, [router]);

    const submitLogin = () => {
        axios.post("http://192.168.0.29:8000/api/login", { email, password }, { withCredentials: true })
            .then(response => {
                router.replace('home')
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorMessages = Object.values(error.response.data).flat().join(' ');
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage('Login failed. Please try again.');
                }
            });
    };

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor={'#666'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor={'#666'}
                    secureTextEntry
                    autoCapitalize="none"
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                <Link href={'/Register'} style={styles.linkText}>Don't have an account? Register</Link>
                <Pressable style={styles.button} onPress={submitLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Login;