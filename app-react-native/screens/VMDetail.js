import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Subheading, Switch, Text, Headline, Button} from 'react-native-paper';

import theme from '../config/theme';
import {API_GET_VMS, API_DELETE_VM} from '../config/endpoints-conf';
import {ProgressBar, Caption} from '../components';
import {getUserIdToken} from '../services/Firebase';

export default function VMDetail({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [vmInfo, setVmInfo] = useState(route.params.vm);
  const [refresh, setRefresh] = useState(true);
  const {id, name, image, status, networks, region, vcpus, memory, disk, created_at, products} = vmInfo;

  useEffect(() => {
    const fetchVMInfo = async () => {
      setLoading(true);
      const token = await getUserIdToken();
      const result = await fetch(API_GET_VMS + id, {
        headers: {
          Authorization: token,
        },
      });
      const resultJson = await result.json();
      setVmInfo(resultJson);
      setLoading(false);
    };

    if (refresh) {
      setRefresh(false);
      fetchVMInfo();
    }
  }, [refresh]);

  const handleOnOffSwitchChange = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ProgressBar loading={loading} />
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Subheading>{`${image.distribution} ${image.name}`}</Subheading>
              <View style={styles.row}>
                <Switch
                  style={{marginRight: 5}}
                  value={status === 'active'}
                  onValueChange={() => handleOnOffSwitchChange()}
                />
                <Text>{status === 'active' ? 'ON' : 'OFF'}</Text>
              </View>
            </View>
            <Caption>
              {`created ${Math.round((Date.now() - Date.parse(created_at)) / 60000)} minutes ago`}
              {` at ${region.name} data center`}
            </Caption>
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
            {Object.keys(products).length === 0 && products.constructor === Object ? (
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
              {
                /*
              <Grid item xs>
                <ProductCards
                  products={this.state.products}
                  handleProductActions={this.handleProductActions}
                  vmId={id}
                  productsInVM={products}
                  displayAll={false}
                />
              </Grid>
              */
              }
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
});
