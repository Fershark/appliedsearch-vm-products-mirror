import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {logInUser} from '../services/Firebase';
import {API_CREATE_USER} from '../config/endpoints-conf';

export default function SignUp() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = () => {
    let valid = true;

    if (name === '') {
      setNameError('Full name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (email === '') {
      setEmailError('Email address is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password === '') {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      setLoading(true);
      fetch(API_CREATE_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          phone: ' ',
          name: name,
          address: ' ',
        }),
      })
        .then(res => Promise.all([res.ok, res.json()]))
        .then(([ok, res]) => {
          if (!ok) {
            console.log('Error during the sign up', ok, res);
            const {message} = res;
            setLoading(false);
            setEmailError(message);
          } else {
            console.log('SignUp Success');
            logInUser(email, password, dispatch);
          }
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.marginBottom}>
        <TextInput label="Full name" onChangeText={text => setName(text)} value={name} autoFocus={true} />
        <HelperText type="error" visible={nameError !== ''}>
          {nameError}
        </HelperText>
      </View>
      <View style={styles.marginBottom}>
        <TextInput
          label="Email address"
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        <HelperText type="error" visible={emailError !== ''}>
          {emailError}
        </HelperText>
      </View>
      <View style={styles.marginBottom}>
        <TextInput label="Password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} />
        <HelperText type="error" visible={passwordError !== ''}>
          {passwordError}
        </HelperText>
      </View>
      <Button
        style={styles.marginBottom}
        mode="contained"
        loading={loading}
        disabled={loading}
        onPress={() => submit()}>
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
});
