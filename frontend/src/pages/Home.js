import React from 'react';
import {Container} from '@material-ui/core';

import Drawer from '../components/Drawer';
import {getUserIdToken} from '../services/firebase';

class Home extends React.Component {
  render() {
    const {appStyle} = this.props;
    getUserIdToken().then(token => console.log({token}));
    return (
      <div className={appStyle.root}>
        <Drawer />
        <main className={appStyle.content}>
          <Container maxWidth="lg" className={appStyle.container}>
            Home page content
          </Container>
        </main>
      </div>
    );
  }
}

export default Home;
