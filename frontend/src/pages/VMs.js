import React from 'react';
import {Container, Paper, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {Redirect} from 'react-router';
import {useRouteMatch} from 'react-router-dom';
import {Drawer, Title, MaterialTable} from '../components';

class VMs extends React.Component {
  render() {
    const {appStyle, match, history} = this.props;
    const {url} = match;
    return (
      <React.Fragment>
        <Drawer open={true} />
        <main className={appStyle.content}>
          <Container maxWidth="lg" className={appStyle.container}>
            <MaterialTable
              title={<Title>Virtual Machines</Title>}
              columns={[
                {title: 'Name', field: 'name'},
                {title: 'Email', field: 'email'},
                {title: 'Version', field: 'version'},
                {title: 'Status', field: 'status'},
                {title: 'IP Address', field: 'ipAddress'},
              ]}
              data={[
                {
                  name: 'CSIS 4495 - 001',
                  email: 'test@student.douglascollege.ca',
                  version: 'Ubuntu 18.04',
                  status: 'Processing',
                  ipAddress: '',
                },
                {
                  name: 'CSIS 4495 - 001',
                  email: 'test1@student.douglascollege.ca',
                  version: 'Ubuntu 18.04',
                  status: 'Running',
                  ipAddress: '1.1.1.1',
                },
              ]}
              addClicked={(event, rowData) => history.push(`${url}/add`)}
            />
          </Container>
        </main>
      </React.Fragment>
    );
  }
}

export default VMs;