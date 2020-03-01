import React from 'react';
import {Grid, TextField, Button, Link} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';

import {logInUser} from '../actions/authenticate';

export default function Login({setIsSignUp, setLoading, setFetchMessage, setLoginSuccessful}) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleForm = event => {
    event.preventDefault();
    const {email, password} = event.target;
    setLoading(true);

    logInUser(email.value, password.value, dispatch)
      .then(() => setLoginSuccessful(true))
      .catch(err => {
        const {message} = err;
        setLoading(false);
        setFetchMessage(message);
      });
  };

  return (
    <>
      <h1>Sign in</h1>
      <form autoComplete="off" onSubmit={handleForm}>
        <Grid item xs={12} sm={12}>
          <TextField
            margin="normal"
            autoComplete="email"
            name="email"
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoFocus
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
            <Link variant="body2">Forgot password?</Link>
          </Grid>
          <Grid item xs>
            <Link variant="body2" onClick={() => setIsSignUp(true)}>
              Don't have an account?
              <br />
              Sign Up
            </Link>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
