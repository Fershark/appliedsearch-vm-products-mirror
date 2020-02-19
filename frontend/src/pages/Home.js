import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Container} from '@material-ui/core';
import homeStyles from '../assets/jss/views/home';
import Drawer from '../components/Drawer';

class Home extends React.Component {
  render() {
    //const {classes} = this.props;
    const {appStyle} = this.props;
    return (
      <div className={appStyle.root}>
        <Drawer open={true} />
        <main className={appStyle.content}>
          <Container maxWidth="lg" className={appStyle.container}>
            Home page content
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(homeStyles)(Home);
