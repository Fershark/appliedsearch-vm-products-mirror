import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Avatar, Link, Grid, Container, LinearProgress, Typography, TextField, Button} from '@material-ui/core';
import {toast} from 'react-toastify';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {withStyles} from '@material-ui/core/styles';
import styles from '../assets/jss/views/login';
import {ToastContainer} from 'react-toastify';
import {doSignInWithEmailAndPassword} from '../actions/authenticate';
import AppBar from '../components/AppBar';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    if (this.props.user === null) {
      console.log('USER NOT LOGIN YET');
      this.props.history.push('/login');
    } else {
      console.log('USER SIGNED IN, SO REDIRECT TO HOME PAGE');
      this.props.history.push('/home');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== null) {
      this.props.history.push('/home');
    } else if (this.props.auth_message.message !== '') {
      toast.error(this.props.auth_message.message);
    }
  }

  handleLogin(e) {
    const email = e.target.email.value;
    const password = e.target.password.value;
    this.props.login(email, password);
    e.preventDefault();
  }

  render() {
    const {classes, appStyle} = this.props;
    return (
      <React.Fragment>
        <AppBar open={false} />
        <div className={appStyle.appBarSpacer} />
        {this.props.auth_processing && <LinearProgress color="secondary" />}
        <Container component="main" maxWidth="xs">
          <ToastContainer />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={this.handleLogin}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                Sign In
              </Button>
              <Grid container className={classes.gridContainer}>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    auth_processing: state.auth.auth_processing,
    auth_message: state.auth.auth_message,
    user: state.auth.user,
  };
};

const mapDispatchtoProps = dispatch => {
  return {
    login: (email, password) => dispatch(doSignInWithEmailAndPassword(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchtoProps)(withStyles(styles)(Login));
