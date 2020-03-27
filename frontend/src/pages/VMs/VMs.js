import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import {Container} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import {Drawer, Title, MaterialTable, LoadingPage} from '../../components';
import {API_GET_VMS, API_DELETE_VM} from '../../config/endpoints-conf';
import {getUserIdToken} from '../../services/firebase';

export default function VMs({appStyle, match, history}) {
  const {url} = match;
  const [loading, setLoading] = useState(true);
  const [vms, setVms] = useState([]);// stateName and method to set state

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
            const {id, name, image, status, networks, region, vcpus, memory, disk} = currentValue;
            accumulator.push({
              id,
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

  const deleteVM = ({id}) => {
    setLoading(true);
    getUserIdToken()
      .then(token =>
        fetch(`${API_DELETE_VM}${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        }),
      )
      .then(res => Promise.all([res.ok, res.json()]))
      .then(([ok, res]) => ok && window.location.reload(false))
      .catch(error => {
        setLoading(false);
      });
  };

  return (
    <div className={appStyle.root}>
      <LoadingPage open={loading} />
      <Drawer />
      <main className={appStyle.content}>
        <Container maxWidth="lg" className={appStyle.container}>
          <MaterialTable
            title={<Title>Virtual Machines</Title>}
            columns={[
              {title: 'Name', field: 'name',
            render: rowData => <Link to={"/vms/" + rowData.id}
            style={{textDecoration: 'none', fontWeight: 'bold'}}>{rowData.name}</Link>},
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
            actions={[
              {
                icon: DeleteIcon,
                tooltip: 'Delete',
                onClick: (event, rowData) => deleteVM(rowData),
              },
            ]}
          />
        </Container>
      </main>
    </div>
  );
}
