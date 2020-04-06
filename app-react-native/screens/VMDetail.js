import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Subheading, Switch, Text, Headline, Button, Card, Title, Paragraph} from 'react-native-paper';

import theme from '../config/theme';
import {API_GET_VMS, API_DELETE_VM} from '../config/endpoints-conf';
import {ProgressBar, Caption} from '../components';
import {getUserIdToken} from '../services/Firebase';

export default function VMDetail({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [vmInfo, setVmInfo] = useState(route.params.vm);
  const [statusText, setStatusText] = useState(route.params.vm.status === 'active' ? 'ON' : 'OFF');
  const {id, name, image, status, networks, region, vcpus, memory, disk, created_at, products} = vmInfo;

  const getData = useCallback(() => {
    const fetchVMInfo = async () => {
      setLoading(true);
      const token = await getUserIdToken();
      const result = await fetch(API_GET_VMS + id, {
        headers: {
          Authorization: token,
        },
      });
      const resultJson = await result.json();
      let products = [];
      for (let [id, data] of Object.entries(resultJson.products)) {
        products.push({id, ...data});
      }
      resultJson.products = products;
      setStatusText(resultJson.status === 'active' ? 'ON' : 'OFF');
      setVmInfo(resultJson);
      setLoading(false);
    };
    fetchVMInfo();
  }, []);

  useEffect(() => {
    if (route.params.refresh) {
      route.params.refresh = false;
      getData();
    }
  }, [route.params.refresh, getData]);

  const handleOnOffSwitchChange = async () => {
    setStatusText('Processing');
    const actionType = status === 'active' ? 'power-off' : 'power-on';
    const token = await getUserIdToken();
    try {
      const result = await fetch(`${API_GET_VMS}${id}/${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: token,
        },
      });
      setVmInfo({
        ...vmInfo,
        status: status === 'active' ? 'off' : 'active',
      });
      setStatusText(status === 'active' ? 'OFF' : 'ON');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVm = async () => {
    setLoading(true);
    const token = await getUserIdToken();
    try {
      const resDelete = await fetch(`${API_DELETE_VM}${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
      if (resDelete.ok) {
        console.log('here');
        navigation.dangerouslyGetParent().navigate('VMs', {refresh: true});
      }
    } catch (error) {
      console.log({error});
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ProgressBar loading={loading} />
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getData()} />}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
              <Subheading>{`${image.distribution} ${image.name}`}</Subheading>
              <View style={styles.row}>
                <Switch
                  style={{marginRight: 5}}
                  value={status === 'active'}
                  onValueChange={() => handleOnOffSwitchChange()}
                />
                <Text>{statusText}</Text>
              </View>
            </View>
            <Caption>
              {`created ${Math.round((Date.now() - Date.parse(created_at)) / 60000)} minutes ago`}
              {` at ${region.name} data center`}
            </Caption>
            <View style={{alignItems: 'center'}}>
              <Button style={{backgroundColor: 'red'}} mode="contained" onPress={() => deleteVm()}>
                Delete VM
              </Button>
            </View>
            <Headline style={styles.accentColor}>Size</Headline>
            <View style={styles.row}>
              <Text>VCPUs: </Text>
              <Caption>{vcpus}</Caption>
            </View>
            <View style={styles.row}>
              <Text>Memory: </Text>
              <Caption>{`${memory / 1024} GB`}</Caption>
            </View>
            <View style={styles.row}>
              <Text>Disk: </Text>
              <Caption>{`${disk} GB`}</Caption>
            </View>
            <Headline style={styles.accentColor}>Networking</Headline>
            <View style={styles.row}>
              <Text>IP address: </Text>
              <Caption>{networks.v4[0].ip_address}</Caption>
            </View>
            <View style={styles.row}>
              <Text>Gateway: </Text>
              <Caption>{networks.v4[0].gateway}</Caption>
            </View>
            <View style={styles.row}>
              <Text>Netmask: </Text>
              <Caption>{networks.v4[0].netmask}</Caption>
            </View>
            <Headline style={styles.accentColor}>Products</Headline>
            {products.length === 0 ? (
              <>
                <Text style={styles.textCenter}>Looks like you don’t have any Products.</Text>
                <Caption style={styles.textCenter}>Fortunately, it’s very easy to install one.</Caption>
                <View style={{alignItems: 'center', marginTop: 10}}>
                  <Button mode="contained" onPress={() => navigation.navigate('Marketplace')}>
                    Add Product
                  </Button>
                </View>
              </>
            ) : (
              <View style={styles.cardRoot}>
                {products.map(({id, name, status, version, description}) => (
                  <Card key={id} style={styles.card} onPress={() => {}}>
                    <Card.Content style={{justifyContent: 'space-between', height: 214}}>
                      <View style={{}}>
                        <Title style={styles.primaryColor}>{name}</Title>
                        <Paragraph numberOfLines={5}>{description}</Paragraph>
                      </View>
                      <Caption style={styles.textCenter}>
                        {`${status[0].toUpperCase()}${status.slice(1)} version ${version}`}
                      </Caption>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  accentColor: {
    color: theme.colors.accent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  //CARDs
  cardRoot: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    flexBasis: 'auto',
    marginBottom: 30,
  },
  primaryColor: {
    color: theme.colors.primary,
  },
  card: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#676767',
    marginBottom: 10,
    width: 160,
    height: 200,
  },
});
