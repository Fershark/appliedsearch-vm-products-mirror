import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Link, Grid, LinearProgress} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import {useSelector} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';

import config from '../config';
import landingPageStyles from '../assets/jss/views/landingPage';
import backgroundLandingImage from '../assets/images/bg-landing-page.jpg';
import {SignUpForm, SignInForm} from '../components';

const useStyles = makeStyles(landingPageStyles);

export default function LandingPage({history}) {
  const {user} = useSelector(state => state.auth);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [fetchMessage, setFetchMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    if (fetchMessage !== '') {
      toast.error(fetchMessage);
    }

    return () => {
      setFetchMessage('');
    };
  }, [fetchMessage]);

  useEffect(() => {
    if (loginSuccessful === true) {
      history.push('/home');
    }
  }, [loginSuccessful, history]);

  return (
    <React.Fragment>
      <Box
        className={classes.headerNavigation}
        display="flex"
        flexDirection="row-reverse"
        p={1}
        m={1}
        bgcolor="background.paper">
        {user !== null && (
          <Box p={1}>
            <Link href="/logout">Sign out</Link>
          </Box>
        )}
        <Box p={1}>
          {user === null ? (
            isSignUp ? (
              <Link onClick={() => setIsSignUp(!isSignUp)}>Sign in</Link>
            ) : (
              <Link onClick={() => setIsSignUp(!isSignUp)}>Sign up</Link>
            )
          ) : (
            <Link href="/home">Home</Link>
          )}
        </Box>
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

      {loading && <LinearProgress color="secondary" />}
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
          {user === null && (
            <Grid item xs={12} md={6}>
              <Paper style={{padding: '1px 20px 20px'}}>
                {isSignUp ? (
                  <SignUpForm
                    setIsSignUp={setIsSignUp}
                    setLoading={setLoading}
                    setFetchMessage={setFetchMessage}
                    setLoginSuccessful={setLoginSuccessful}
                  />
                ) : (
                  <SignInForm
                    setIsSignUp={setIsSignUp}
                    setLoading={setLoading}
                    setFetchMessage={setFetchMessage}
                    setLoginSuccessful={setLoginSuccessful}
                  />
                )}
              </Paper>
            </Grid>
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
