import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Card,
  Title,
  Paragraph,
  Portal,
  Dialog,
  Headline,
  TouchableRipple,
  RadioButton,
  Subheading,
  Button,
  Caption,
} from 'react-native-paper';

import theme from '../config/theme';
import {API_GET_VMS, API_GET_PRODUCTS, API_CREATE_ACTION} from '../config/endpoints-conf';
import {getUserIdToken} from '../services/Firebase';
import {ProgressBar} from '../components';

export default function VMMarketplace({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [vmInfo, setVmInfo] = useState(route.params.vm);
  const [products, setProducts] = useState([]);
  const [choosingProduct, setChoosingProduct] = useState(-1);
  const [product, setProduct] = useState(null);

  const getData = useCallback(() => {
    const data = async () => {
      setLoading(true);
      const token = await getUserIdToken();
      const [resultGetVm, resultGetProducts] = await Promise.all([
        fetch(API_GET_VMS + vmInfo.id, {
          headers: {
            Authorization: token,
          },
        }),
        fetch(API_GET_PRODUCTS),
      ]);

      const [resultGetVmJson, resultGetProductsJson] = await Promise.all([
        resultGetVm.json(),
        resultGetProducts.json(),
      ]);
      let products = {};
      for (let [id, data] of Object.entries(resultGetVmJson.products)) {
        products[data.name] = {id, ...data};
      }
      resultGetVmJson.products = products;
      setVmInfo(resultGetVmJson);
      setProducts(Object.entries(resultGetProductsJson));

      setLoading(false);
      if (product !== null) {
        setProduct(null);
        navigation.navigate('VM Info', {refresh: true});
      }
    };
    data();
  }, [product]);

  useEffect(() => {
    console.log('refresh ', route.params.refresh);
    if (route.params.refresh) {
      route.params.refresh = false;
      getData();
    }
  }, [route.params.refresh, getData]);

  const hideProductDialog = () => {
    setChoosingProduct(-1);
    setProduct(null);
  };

  const installProduct = async () => {
    setLoading(true);
    setProduct({...product, status: `Installing version ${product.version}`});

    const token = await getUserIdToken();
    const result = await fetch(API_CREATE_ACTION, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        vm_id: vmInfo.id,
        type: 'install',
        product: product.id,
      }),
    });

    //convert to JSON
    const action = await result.json();

    if (result.ok) {
      //success
      getData();
    } else {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar loading={loading} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getData()} />}>
        <View style={styles.cardRoot}>
          {products.map(([productName, details], index) => (
            <Card
              key={productName}
              style={styles.card}
              onPress={() => {
                if (vmInfo.products[productName] === undefined && product === null) {
                  setChoosingProduct(index);
                }
              }}>
              <Card.Content style={{justifyContent: 'space-between', height: 214}}>
                <View style={{}}>
                  <Title style={styles.primaryColor}>{productName}</Title>
                  <Paragraph numberOfLines={5}>{details[0].description}</Paragraph>
                </View>
                <Caption style={styles.textCenter}>
                  {vmInfo.products[productName] !== undefined
                    ? `${vmInfo.products[productName].status[0].toUpperCase()}${vmInfo.products[
                        productName
                      ].status.slice(1)} version ${vmInfo.products[productName].version}`
                    : product !== null && product.name === productName
                    ? 'Processing'
                    : 'Choose a version to install'}
                </Caption>
              </Card.Content>
            </Card>
          ))}
          {/*Dialog for choosing product version*/}
          <Portal>
            <Dialog visible={choosingProduct > -1} onDismiss={hideProductDialog}>
              <Dialog.Title>
                <Headline style={styles.accentColor}>
                  {choosingProduct > -1 ? `${products[choosingProduct][0]}\n` : ''}
                </Headline>
                <Paragraph>{choosingProduct > -1 ? `${products[choosingProduct][1][0].description}\n` : ''}</Paragraph>
                Choose a version
              </Dialog.Title>
              <Dialog.ScrollArea style={{maxHeight: 170, paddingHorizontal: 0}}>
                <ScrollView>
                  <View>
                    {choosingProduct > -1 &&
                      products[choosingProduct][1].map(({id, description, version}) => (
                        <TouchableRipple
                          onPress={() =>
                            setProduct({
                              id,
                              description,
                              version,
                              name: products[choosingProduct][0],
                              status: null,
                            })
                          }
                          key={id}>
                          <View style={styles.row}>
                            <View pointerEvents="none">
                              <RadioButton
                                value="normal"
                                status={product !== null && id === product.id ? 'checked' : 'unchecked'}
                              />
                            </View>
                            <Subheading style={{paddingLeft: 8}}>{version}</Subheading>
                          </View>
                        </TouchableRipple>
                      ))}
                  </View>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={hideProductDialog}>Cancel</Button>
                <Button
                  onPress={() => {
                    if (product) {
                      installProduct();
                      setChoosingProduct(-1);
                    }
                  }}>
                  Install
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>
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
  accentColor: {
    color: theme.colors.accent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textCenter: {
    textAlign: 'center',
  },
});
