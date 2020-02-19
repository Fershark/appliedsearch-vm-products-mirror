import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Link, Grid, TextField, Button} from '@material-ui/core';

import landingPageStyles from '../assets/jss/views/landingPage';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
const backgroundLandingImage = require('../assets/images/bg-landing-page.jpg');

class LandingPage extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <Box
          className={classes.headerNavigation}
          display="flex"
          flexDirection="row-reverse"
          p={1}
          m={1}
          bgcolor="background.paper">
          <Box p={1}>
            <Link>Sign in</Link>
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
              <Link href={'/'} style={{textDecoration: 'none', color: `rgba(3,27,78,.7)`}}>
                Virtual Machine Products
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

        <main className={classes.mainHeaderContent} style={{backgroundImage: `url(${backgroundLandingImage})`}}>
          <Grid container spacing={1} className={classes.mainContent}>
            <Grid item xs={12} md={6}>
              <h2 className={classes.welcomeHeader}>Welcome to MyVirtualMachine</h2>
              <p className={classes.welcomeParagraph}>
                We make it simple to launch in the cloud and scale up as you grow – with an intuitive control panel,
                predictable pricing, team accounts, and more.
              </p>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <h1>Sign up your account</h1>
                <form className={classes.formSignUp} noValidate autoComplete="off">
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
                    className={classes.btnSignUp}>
                    Sign Up
                  </Button>
                </form>
              </Paper>
            </Grid>
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
              Leave complex pricing structures behind. Always know what you’ll pay per month with a flat,
              industry-leading pricing structure.{' '}
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
}

export default withStyles(landingPageStyles)(LandingPage);
