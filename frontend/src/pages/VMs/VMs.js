import React, {useState, useEffect} from 'react';
import {Container} from '@material-ui/core';

import {Drawer, Title, MaterialTable, LoadingPage} from '../../components';
import {API_GET_VMS} from '../../config/endpoints-conf';
import {getUserIdToken} from '../../actions/authenticate';

export default function VMs({appStyle, match, history}) {
  const {url} = match;
  const [loading, setLoading] = useState(true);
  const [vms, setVms] = useState([]);

  useEffect(() => {
    getUserIdToken()
      .then(token =>
        fetch(API_GET_VMS, {
          headers: {
            Authorization: token,
          },
        }),
      )
      .then(res => Promise.all([res.ok, res.json()]))
      .then(([ok, res]) => {
        if (ok) {
          let parsedVMs = res.reduce((accumulator, currentValue) => {
            const {name, image, status, networks, region, vcpus, memory, disk} = currentValue;
            accumulator.push({
              name,
              distribution: `${image.distribution} ${image.name}`,
              status,
              ipAddress: networks.v4[0].ip_address,
              region: region.name.substring(0, region.name.length - 1),
              cpus: vcpus,
              memory: `${memory / 1024} GB`,
              disk: `${disk} GB SSD`,
            });
            return accumulator;
          }, []);
          setVms(parsedVMs);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={appStyle.root}>
      <LoadingPage open={loading} />
      <Drawer />
      <main className={appStyle.content}>
        <Container maxWidth="lg" className={appStyle.container}>
          <MaterialTable
            title={<Title>Virtual Machines</Title>}
            columns={[
              {title: 'Name', field: 'name'},
              {title: 'Distribution', field: 'distribution'},
              {title: 'Status', field: 'status'},
              {title: 'IP address', field: 'ipAddress'},
              {title: 'Region', field: 'region'},
              {title: 'CPUs', field: 'cpus'},
              {title: 'Memory', field: 'memory'},
              {title: 'Disk', field: 'disk'},
            ]}
            data={vms}
            addClicked={(event, rowData) => history.push(`${url}/add`)}
          />
        </Container>
      </main>
    </div>
  );
}
