import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Link, Grid, TextField, Button, LinearProgress} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import {useDispatch, useSelector} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';

import config from '../config';
import landingPageStyles from '../assets/jss/views/landingPage';
import {accountSignUp} from '../actions/authenticate';
import backgroundLandingImage from '../assets/images/bg-landing-page.jpg';

const useStyles = makeStyles(landingPageStyles);

export default function LandingPage({history}) {
  const dispatch = useDispatch();
  const {user, auth_processing, auth_message} = useSelector(state => state.auth);
  const classes = useStyles();

  const handleForm = event => {
    event.preventDefault();
    const {fullName, email, password} = event.target;
    dispatch(accountSignUp(fullName.value, email.value, password.value));
  };

  useEffect(() => {
    if (auth_message.message !== '') {
      toast.error(auth_message.message);
    }
  }, [auth_message.message]);

  useEffect(() => {
    if (auth_message.success === true) {
      history.push('/home');
    }
  }, [auth_message.success, history]);

  return (
    <React.Fragment>
      <Box
        className={classes.headerNavigation}
        display="flex"
        flexDirection="row-reverse"
        p={1}
        m={1}
        bgcolor="background.paper">
        {user === null ? (
          ''
        ) : (
          <Box p={1}>
            <Link href="/logout">Sign out</Link>
          </Box>
        )}
        <Box p={1}>{user === null ? <Link href="/login">Sign in</Link> : <Link href="/home">Home</Link>}</Box>
        <Box p={1}>
          <Link>Get support</Link>
        </Box>
        <Box p={1}>
          <Link>Docs</Link>
        </Box>
      </Box>

      <Box className={classes.mainNavigation} display="flex">
        <ul>
          <li>
            <Link href={'/'} style={{textDecoration: 'none'}} classes={{primary: classes.listItem}}>
              {config.appName}
            </Link>
          </li>
          <li>
            <Link className={classes.menuTitle}>Products</Link>
          </li>
          <li>
            <Link className={classes.menuTitle}>Partners</Link>
          </li>
          <li>
            <Link className={classes.menuTitle}>Pricing</Link>
          </li>
        </ul>
      </Box>

      {auth_processing && <LinearProgress color="secondary" />}
      <ToastContainer />

      <main className={classes.mainHeaderContent} style={{backgroundImage: `url(${backgroundLandingImage})`}}>
        <Grid container spacing={1} className={classes.mainContent}>
          <Grid item xs={12} md={user === null ? 6 : 12}>
            <h2 className={classes.welcomeHeader}>{config.appName}</h2>
            <p className={classes.welcomeParagraph}>
              We make it simple to launch in the cloud and scale up as you grow – with an intuitive control panel,
              predictable pricing, team accounts, and more.
            </p>
          </Grid>
          {user === null ? (
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <h1>Sign up your account</h1>
                <form className={classes.formSignUp} autoComplete="off" onSubmit={handleForm}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      margin="normal"
                      autoComplete="fname"
                      name="FullName"
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
                      name="Email"
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
                    className={classes.btnSignUp}>
                    Sign Up
                  </Button>
                </form>
              </Paper>
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </main>

      <Grid container spacing={1} className={classes.mainFeatures}>
        <h2>Build your business</h2>
        <Grid item xs={4} sm={4} className={classes.itemFeatures}>
          <h3>Reliable platform</h3>
          <p>
            More than 100,000 developer teams worldwide trust DigitalOcean to support their business with a 99.99%
            uptime SLA for all services.{' '}
          </p>
        </Grid>
        <Grid item xs={4} sm={4} className={classes.itemFeatures}>
          <h3>Build app in 1 click</h3>
          <p>
            Leave complex pricing structures behind. Always know what you’ll pay per month with a flat, industry-leading
            pricing structure.{' '}
          </p>
        </Grid>
        <Grid item xs={4} sm={4} className={classes.itemFeatures}>
          <h3>Predictable pricing</h3>
          <p>
            Free around-the-clock technical support for all customers, with additional benefits for premium support
            subscribers. You’ll feel the love.{' '}
          </p>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
