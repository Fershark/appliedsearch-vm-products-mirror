import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {logInUser} from '../services/Firebase';

export default function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = () => {
    let valid = true;

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

      logInUser(email, password, dispatch)
        .then(() => {
          setLoading(false);
          setLoginSuccessful(true);
        })
        .catch(err => {
          const {message} = err;
          setLoading(false);
          setEmailError(message);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.marginBottom}>
        <TextInput
          label="Email address"
          onChangeText={text => setEmail(text)}
          value={email}
          autoFocus={true}
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
