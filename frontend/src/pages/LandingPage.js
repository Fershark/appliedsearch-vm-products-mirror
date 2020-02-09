import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Container} from '@material-ui/core';
import homeStyles from '../assets/jss/views/landingPage';
import Drawer from '../components/Drawer';

class LandingPage extends React.Component {
  render() {
    //const {classes} = this.props;
    const {appStyle} = this.props;
    return (
      <React.Fragment>
        Landing content
        {/* <Drawer open={true} /> */}
        {/* <main className={appStyle.content}>
          <Container maxWidth="lg" className={appStyle.container}>
            Home page content of Landing Page
          </Container>
        </main> */}
      </React.Fragment>
    );
  }
}

export default withStyles(homeStyles)(LandingPage);
