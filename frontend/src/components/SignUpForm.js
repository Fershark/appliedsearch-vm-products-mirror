import React from 'react';
import {Grid, TextField, Button, Link} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {useTheme} from '@material-ui/core/styles';

import {logInUser} from '../services/firebase';
import {API_CREATE_USER} from '../config/endpoints-conf';

export default function SignupForm({setIsSignUp, setLoading, setFetchMessage, setLoginSuccessful}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleForm = event => {
    event.preventDefault();
    const {fullName, email, password} = event.target;
    setLoading(true);

    fetch(API_CREATE_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        phone: ' ',
        name: fullName.value,
        address: ' ',
      }),
    })
      .then(res => Promise.all([res.ok, res.json()]))
      .then(([ok, res]) => {
        if (!ok) {
          console.log('Error during the sign up', ok, res);
          const {message} = res;
          setLoading(false);
          setFetchMessage(message);
        } else {
          console.log('SignUp Success');
          logInUser(email, password, dispatch).then(() => setLoginSuccessful(true));
        }
      });
  };

  return (
    <>
      <h1>Sign up</h1>
      <form autoComplete="off" onSubmit={handleForm}>
        <Grid item xs={12} sm={12}>
          <TextField
            margin="normal"
            autoComplete="fname"
            name="fullName"
            variant="outlined"
            required
            fullWidth
            id="fullName"
            label="Full name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            autoComplete="email"
            name="email"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            id="email"
            label="Email"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
        </Grid>
        <Button
          type="submit"
          fullWidth
          margin="normal"
          variant="contained"
          color="primary"
          style={{marginTop: theme.spacing(2)}}>
          Submit
        </Button>
        <Grid container alignItems="center" style={{marginTop: theme.spacing(2)}}>
          <Grid item xs>
            <Link variant="body2" onClick={() => setIsSignUp(false)}>
              Already have an account?
              <br />
              Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
