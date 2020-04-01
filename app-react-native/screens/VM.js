import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ProgressBar,
  Title,
  Card,
  Subheading,
  TouchableRipple,
  Paragraph,
  Portal,
  Dialog,
  RadioButton,
  Button,
  Divider,
  Headline,
  Caption
} from 'react-native-paper';

import theme from '../config/theme';

import {
  API_GET_VMS_DISTRIBUTIONS,
  API_GET_VMS_SIZES,
  API_GET_VMS_REGIONS,
  API_CREATE_VM,
  API_GET_PRODUCTS,
} from '../config/endpoints-conf';
import {getUserIdToken} from '../services/Firebase';

export default function VM({navigation}) {
  const [loading, setLoading] = useState(true);
  const [distributions, setDistributions] = useState([]);
  const [distribution, setDistribution] = useState({});
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState('');
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState('');
  const [emails, setEmails] = useState([{value: '', error: ''}]);
  const [products, setProducts] = useState({});
  const [productsSelected, setProductsSelected] = useState({});
  //React Native
  const {accent} = theme.colors;
  const [choosingDistribution, setChoosingDistribution] = useState(0);
  const [distributionSlug, setDistributionSlug] = useState('');

  useEffect(() => {
    const getData = async () => {
      const [resDistributions, resSizes, resRegions, resProducts] = await Promise.all([
        fetch(API_GET_VMS_DISTRIBUTIONS),
        fetch(API_GET_VMS_SIZES),
        fetch(API_GET_VMS_REGIONS),
        fetch(API_GET_PRODUCTS),
      ]);
      const [resDistributionsJson, resSizesJson, resRegionsJson, resProductsJson] = await Promise.all([
        resDistributions.json(),
        resSizes.json(),
        resRegions.json(),
        resProducts.json(),
      ]);

      if (resDistributions.ok) {
        const {name, data} = resDistributionsJson[0];
        const {slug} = data[0];
        setDistribution({name, slug});
        setDistributions(resDistributionsJson);
      }
      if (resSizes.ok) {
        let sizesFiltered = resSizesJson.filter(({regions}) => regions.length === 12);
        const {slug} = sizesFiltered[0];
        setSize(slug);
        setSizes(sizesFiltered);
      }
      if (resRegions.ok) {
        let regionsFiltered = resRegionsJson
          .filter(({slug}) => slug.includes('sfo') || slug.includes('nyc') || slug.includes('tor'))
          .reduce((accumulator, currentValue) => {
            const {slug} = currentValue;
            let key = slug.substring(0, slug.length - 1);
            if (accumulator[key] === undefined) {
              accumulator[key] = currentValue;
            }
            return accumulator;
          }, {});
        regionsFiltered = Object.values(regionsFiltered);
        let {slug} = regionsFiltered[0];
        setRegion(slug);
        setRegions(regionsFiltered);
      }
      if (resProducts.ok) {
        let productsSelected = {};
        for (let products in resProductsJson) {
          productsSelected[products] = '';
        }
        setProductsSelected(productsSelected);
        setProducts(resProductsJson);
      }
      setLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    if (choosingDistribution > 0) {
      setDistributionSlug('');
    }
  }, [choosingDistribution]);

  const hideDistributionDialog = () => setChoosingDistribution(0);

  console.log({distribution, size, region, emails, products, productsSelected});

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar indeterminate color={accent} style={styles.progressBar} visible={loading} />
      <ScrollView style={styles.scrollView}>
        <Headline style={{color: accent}}>Distributions</Headline>
        <View style={styles.cardRoot}>
          {distributions.map(({name, data}, index) => (
            <Card
              key={name}
              onPress={() => setChoosingDistribution(index + 1)}
              style={[styles.card, styles.distributionCard, name === distribution.name && styles.cardSelected]}>
              <Card.Content>
                <Subheading style={[styles.textCenter]}>{name}</Subheading>

                <Paragraph style={[styles.textCenter]}>
                  {name === distribution.name ? distribution.slug : 'Select version'}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
          {/*Dialog for choosing distribution version*/}
          <Portal>
            <Dialog visible={choosingDistribution > 0} onDismiss={hideDistributionDialog}>
              <Dialog.Title>
                <Headline style={{color: accent}}>
                  {choosingDistribution > 0 ? `${distributions[choosingDistribution - 1].name}\n` : ''}
                </Headline>
                Choose an option
              </Dialog.Title>
              <Dialog.ScrollArea style={{maxHeight: 170, paddingHorizontal: 0}}>
                <ScrollView>
                  <View>
                    {choosingDistribution > 0 &&
                      distributions[choosingDistribution - 1].data.map(({slug, name}) => (
                        <TouchableRipple onPress={() => setDistributionSlug(slug)} key={slug}>
                          <View style={styles.row}>
                            <View pointerEvents="none">
                              <RadioButton
                                value="normal"
                                status={distributionSlug === slug ? 'checked' : 'unchecked'}
                              />
                            </View>
                            <Subheading style={{paddingLeft: 8}}>{name}</Subheading>
                          </View>
                        </TouchableRipple>
                      ))}
                  </View>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={hideDistributionDialog}>Cancel</Button>
                <Button
                  onPress={() => {
                    if (distributionSlug) {
                      const {name} = distributions[choosingDistribution - 1];
                      setDistribution({name, slug: distributionSlug});
                      hideDistributionDialog();
                    }
                  }}>
                  Ok
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
        <Headline style={{color: accent}}>Sizes</Headline>
        <View style={styles.cardRoot}>
          {sizes.map(({slug, memory, vcpus, disk, transfer, price_monthly, price_hourly}) => (
            <Card key={slug} onPress={() => setSize(slug)} style={[styles.card, slug === size && styles.cardSelected]}>
              <Card.Content>
                <Title style={[styles.textCenter]}>{`$${price_monthly}/mo`}</Title>
                <Caption style={[styles.textCenter]}>{`${price_hourly.toFixed(3)}/hour`}</Caption>
              </Card.Content>
              <Divider style={{marginVertical: 5}}/>
              <Card.Content>
                <Paragraph style={[styles.textCenter]}>
                  {`${price_hourly.toFixed(3)}/hour\n`}
                  {memory / 1024} GB/{vcpus} CPU{'\n'}
                  {disk} GB SSD disk{'\n'}
                  {transfer} TB transfer{'\n'}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
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
  progressBar: {
    position: 'absolute',
    top: 0,
  },
  cardRoot: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    flexBasis: 'auto',
  },
  card: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#676767',
    marginBottom: 10,
    width: 150,
  },
  distributionCard: {
    width: 160,
  },
  cardSelected: {
    borderColor: theme.colors.accent,
  },
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
