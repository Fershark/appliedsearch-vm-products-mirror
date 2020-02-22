import React from 'react';
import {Container} from '@material-ui/core';

import {Drawer, Title, MaterialTable} from '../../components';

export default function VMs({appStyle, match, history}) {
  const {url} = match;
  return (
    <div className={appStyle.root}>
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
    </div>
  );
}
