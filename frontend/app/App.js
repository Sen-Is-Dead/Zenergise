import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import Register from './components/Register/Register.js';
import Login from './components/Login/Login.js';
import Navbar from './components/Navbar/Navbar.js';
import styles from './App.Styles';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://192.168.0.29:8000"
});

const App = () => {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    client.get("/api/user")
      .then(res => setCurrentUser(true))
      .catch(error => setCurrentUser(false));
  }, []);

  const toggleRegistrationForm = () => setRegistrationToggle(!registrationToggle);

  const submitRegistration = (e) => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    const registrationData = { email, password, confirm_password: confirmPassword };
    client.post("/api/register", registrationData)
      .then(res => {
        setCurrentUser(true);
        setErrorMessage('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('An error occurred during registration.');
        }
      });
  };

  const submitLogin = () => {
    client.post("/api/login", { email, password })
      .then(res => {
        setCurrentUser(true);
        setErrorMessage('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Incorrect credentials');
        }
      });
  };

  const submitLogout = () => {
    client.post("/api/logout", { withCredentials: true })
      .then(res => setCurrentUser(false));
  };

  return (
    <View style={{ flex: 1 }}>
      {currentUser ? (
        <View style={styles.container}>
          <Text style={styles.header}>You're logged in!</Text>
          <Button onPress={submitLogout} title="Logout" />
        </View>
      ) : (
        <View style={styles.container}>
          {registrationToggle ? (
            <Register
              setEmail={setEmail}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              submitRegistration={submitRegistration}
              errorMessage={errorMessage}
            />
          ) : (
            <Login {...{ setEmail, setPassword, submitLogin, errorMessage }} />
          )}
          <Button onPress={toggleRegistrationForm} title={registrationToggle ? "Go to Login" : "Go to Register"} />
        </View>
      )}
      <Navbar />
    </View>
  );  
};

export default App;
