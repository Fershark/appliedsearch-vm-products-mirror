import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Container} from '@material-ui/core';
import homeStyles from '../assets/jss/views/home';
import Drawer from '../components/Drawer';

class Home extends React.Component {
  render() {
    const {classes, appStyle} = this.props;
    console.log(appStyle);
    //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
      <React.Fragment>
        <Drawer open={true} />
        <main className={appStyle.content}>
          <Container maxWidth="lg" className={classes.container}>
            Home page content
          </Container>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(homeStyles)(Home);
