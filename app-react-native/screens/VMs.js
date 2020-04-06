import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {List, FAB} from 'react-native-paper';

import {API_GET_VMS} from '../config/endpoints-conf';
import {getUserIdToken} from '../services/Firebase';
import {ProgressBar} from '../components';

export default function VMs({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [vms, setVms] = useState([]);

  const getData = useCallback(() => {
    const call = async () => {
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
    call();
  }, []);

  useEffect(() => {
    if (route.params.refresh) {
      route.params.refresh = false;
      getData();
    }
  }, [route.params.refresh, getData]);

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
        onRefresh={() => getData()}
        refreshing={loading}
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
