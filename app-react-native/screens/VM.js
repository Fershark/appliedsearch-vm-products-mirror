import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
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
  Caption,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import {TextInput as NativeTextInput} from 'react-native';

import theme from '../config/theme';
import {
  API_GET_VMS_DISTRIBUTIONS,
  API_GET_VMS_SIZES,
  API_GET_VMS_REGIONS,
  API_CREATE_VM,
  API_GET_PRODUCTS,
} from '../config/endpoints-conf';
import {getUserIdToken} from '../services/Firebase';
import {ProgressBar} from '../components';

export default function VM({route, navigation}) {
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
  const [choosingDistribution, setChoosingDistribution] = useState(0);
  const [distributionSlug, setDistributionSlug] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

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
      let regionsSet = null;

      if (resDistributions.ok) {
        const {name, data} = resDistributionsJson[0];
        const {slug} = data[0];
        setDistribution({name, slug});
        setDistributions(resDistributionsJson);
      }
      if (resRegions.ok) {
        regionsSet = {};
        let regionsFiltered = resRegionsJson
          .filter(({slug}) => slug.includes('sfo') || slug.includes('nyc') || slug.includes('tor'))
          .reduce((accumulator, currentValue) => {
            const {slug} = currentValue;
            let key = slug.substring(0, slug.length - 1);
            if (accumulator[key] === undefined) {
              accumulator[key] = currentValue;
              regionsSet[slug] = currentValue;
            }
            return accumulator;
          }, {});
        regionsFiltered = Object.values(regionsFiltered);
        let {slug} = regionsFiltered[0];
        setRegion(slug);
        setRegions(regionsFiltered);
      }
      if (resSizes.ok && regionsSet !== null) {
        const regionsLength = Object.keys(regionsSet).length;
        let sizesFiltered = resSizesJson.filter(({regions}) => {
          let valid = 0;
          for (let region of regions) {
            if (regionsSet[region] !== undefined) {
              valid++;
            }
          }
          return valid == regionsLength;
        });
        const {slug} = sizesFiltered[0];
        setSize(slug);
        setSizes(sizesFiltered);
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

  const submitVm = () => {
    let valid = true;
    let newEmails = emails.slice();
    let filteredEmails = [];
    for (let i = 0; i < emails.length; i++) {
      filteredEmails.push(newEmails[i].value);
      if (newEmails[i].value === '') {
        valid = false;
        newEmails[i] = {...newEmails[i], error: ' '};
      } else {
        newEmails[i] = {...newEmails[i], error: ''};
      }
    }
    setEmails(newEmails);
    if (!valid) {
      setSnackbarVisible(true);
    } else {
      setLoading(true);
      getUserIdToken()
        .then(token =>
          fetch(API_CREATE_VM, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              size: size,
              region: region,
              names: filteredEmails,
              image: distribution.slug,
            }),
          }),
        )
        .then(res => Promise.all([res.ok, res.json()]))
        .then(([ok, res]) => {
          if (ok) {
            navigation.navigate('VMs', {refresh: true});
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar loading={loading} />
      <ScrollView style={styles.scrollView}>
        <Headline style={styles.accentColor}>Distributions</Headline>
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
                <Headline style={styles.accentColor}>
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
        <Headline style={styles.accentColor}>Sizes</Headline>
        <View style={styles.cardRoot}>
          {sizes.map(({slug, memory, vcpus, disk, transfer, price_monthly, price_hourly}) => (
            <Card key={slug} onPress={() => setSize(slug)} style={[styles.card, slug === size && styles.cardSelected]}>
              <Card.Content>
                <Title style={[styles.textCenter]}>{`$${price_monthly}/mo`}</Title>
                <Caption style={[styles.textCenter]}>{`${price_hourly.toFixed(3)}/hour`}</Caption>
              </Card.Content>
              <Divider style={{marginVertical: 5}} />
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
        <Headline style={styles.accentColor}>Regions</Headline>
        <View style={styles.cardRoot}>
          {regions.map(({name, slug}) => (
            <Card
              key={slug}
              style={[styles.card, slug === region && styles.cardSelected]}
              onPress={() => setRegion(slug)}>
              <Card.Content>
                <Title style={styles.textCenter}>{`${name.substring(0, name.length - 2)}`}</Title>
              </Card.Content>
            </Card>
          ))}
        </View>
        <Headline style={styles.accentColor}>How many?</Headline>
        <View style={styles.stepperContainer}>
          <View>
            <Button
              mode="contained"
              onPress={() => setEmails(emails.length > 1 ? emails.splice(0, emails.length - 1) : emails)}>
              -
            </Button>
          </View>
          <NativeTextInput
            editable={false}
            style={styles.stepperInput}
            value={emails.length.toString()}
            textAlign="center"
          />
          <View>
            <Button
              mode="contained"
              onPress={() => setEmails(emails.length < 9 ? [...emails, {value: '', error: ''}] : emails)}>
              +
            </Button>
          </View>
        </View>
        <Headline style={styles.accentColor}>Virtual Machines Names</Headline>
        {emails.map((email, index) => (
          <TextInput
            mode="outlined"
            key={index}
            placeholder={`Name ${index + 1}`}
            value={email.value}
            style={{marginBottom: 10}}
            error={email.error !== ''}
            onChangeText={text => {
              let newEmails = emails.slice();
              newEmails[index] = {value: text, error: ''};
              setEmails(newEmails);
            }}
          />
        ))}
        <Button style={{marginBottom: 40}} mode="contained" loading={loading} disabled={loading} onPress={submitVm}>
          Create VM
        </Button>
        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
          There are some errors.
        </Snackbar>
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
  accentColor: {
    color: theme.colors.accent,
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
  stepperContainer: {
    flex: 1,
    flexDirection: 'row',
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperInput: {
    flex: 2,
    marginHorizontal: 5,
    paddingVertical: 18,
    fontWeight: 'bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
  },
});
