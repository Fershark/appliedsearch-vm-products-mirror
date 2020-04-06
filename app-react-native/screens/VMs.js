import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {List, FAB} from 'react-native-paper';

import {API_GET_VMS, API_DELETE_VM} from '../config/endpoints-conf';
import {getUserIdToken} from '../services/Firebase';
import {ProgressBar} from '../components';

export default function VMs({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [vms, setVms] = useState([]);
  const [refresh, setRefresh] = useState(route.params.refresh);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const token = await getUserIdToken();
      const resVms = await fetch(API_GET_VMS, {
        headers: {
          Authorization: token,
        },
      });
      const resVmsJson = await resVms.json();
      if (resVms.ok) {
        setVms(
          resVmsJson.reduce((accumulator, currentValue) => {
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
          }, []),
        );
      }
      setLoading(false);
    };

    if (route.params.refresh) {
      route.params.refresh = false;
      getData();
    }
  }, [route.params.refresh]);

  const deleteVm = async ({id}) => {
    setLoading(true);
    const token = await getUserIdToken();
    try {
      const resDelete = fetch(`${API_DELETE_VM}${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
      if (resDelete.ok) {
        route.params.refresh = true;
      }
    } catch (error) {
      console.log({error});
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ProgressBar loading={loading} />
      <FlatList
        data={vms}
        renderItem={({item}) => (
          <List.Item
            title={item.name}
            description={`distribution: ${item.distribution}\nstatus: ${item.status}\nIP: ${item.ipAddress}\nregion: ${item.region}\ncpus: ${item.cpus}\nmemory: ${item.memory}\ndisk: ${item.disk}`}
            descriptionNumberOfLines={7}
            onPress={() => navigation.navigate('VMDetail', {vm: item})}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <FAB style={styles.fab} small icon="plus" onPress={() => navigation.navigate('VM')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
