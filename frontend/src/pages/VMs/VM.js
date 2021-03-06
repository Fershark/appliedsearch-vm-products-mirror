import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {
  Container,
  Paper,
  Card,
  CardHeader,
  CardActions,
  Select,
  MenuItem,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {ToastContainer, toast} from 'react-toastify';

import {Drawer, Title, SubTitle, LoadingPage} from '../../components';
import {
  API_GET_VMS_DISTRIBUTIONS,
  API_GET_VMS_SIZES,
  API_GET_VMS_REGIONS,
  API_CREATE_VM,
  API_GET_PRODUCTS,
} from '../../config/endpoints-conf';
import {getUserIdToken} from '../../services/firebase';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  card: {
    textAlign: 'center',
    border: '1px solid rgb(103, 103, 103)',
    marginBottom: 10,
    width: 150,
  },
  distributionCard: {
    width: 160,
  },
  fillHeight: {
    height: '100%',
  },
  cardSelected: {
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  cardHeader: {
    borderBottom: '1px solid rgb(103, 103, 103)',
  },
  cardHeaderSelected: {
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  stepperButton: {
    height: 56,
  },
  stepperInput: {
    textAlign: 'center',
  },
  emailInput: {
    marginBottom: 10,
  },
  productCard: {
    width: 200,
  }
}));

export default function EditVM({appStyle, match, history}) {
  const {url} = match;
  const isEdit = url.split('/').pop() !== 'add';
  const classes = useStyles();
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
        resProducts.json()
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
          productsSelected[products] = "";
        }
        setProductsSelected(productsSelected);
        setProducts(resProductsJson);
      }
      setLoading(false);
    };

    getData();
  }, []);

  let submitVm = () => {
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
      toast.error('There are some errors.');
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
            history.push('/vms');
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  console.log({distribution, size, region, emails, products, productsSelected});

  return (
    <div className={appStyle.root}>
      <LoadingPage open={loading} />
      <ToastContainer />
      <Drawer />
      <main className={appStyle.content}>
        <Container maxWidth="lg" className={appStyle.container}>
          <Paper className={appStyle.paper}>
            <Title>{isEdit ? 'Edit' : 'Add'} VM</Title>
            <SubTitle>Distributions</SubTitle>
            <div className={classes.cardRoot}>
              {distributions.map(({name, data}) => (
                <Card
                  key={name}
                  className={clsx(
                    classes.card,
                    classes.distributionCard,
                    name === distribution.name && classes.cardSelected,
                  )}>
                  <CardActionArea onClick={() => setDistribution({name, slug: data[0].slug})}>
                    <CardHeader
                      title={name}
                      className={clsx(classes.cardHeader, name === distribution.name && classes.cardHeaderSelected)}
                    />
                  </CardActionArea>
                  <CardActions className={classes.justifyCenter}>
                    <Select
                      value={name === distribution.name ? distribution.slug : ''}
                      displayEmpty
                      onChange={event => setDistribution({name, slug: event.target.value})}>
                      <MenuItem value="" disabled>
                        Select version
                      </MenuItem>
                      {data.map(({slug, name}) => (
                        <MenuItem value={slug} key={slug}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </CardActions>
                </Card>
              ))}
            </div>
            <SubTitle>Sizes</SubTitle>
            <div className={classes.cardRoot}>
              {console.log(sizes)}
              {sizes.map(({slug, memory, vcpus, disk, transfer, price_monthly, price_hourly}) => (
                <Card
                  key={slug}
                  className={clsx(classes.card, slug === size && classes.cardSelected)}
                  onClick={() => setSize(slug)}>
                  <CardActionArea>
                    <CardHeader
                      className={clsx(classes.cardHeader, slug === size && classes.cardHeaderSelected)}
                      title={`$${price_monthly}/mo`}
                      subheader={`${price_hourly.toFixed(3)}/hour`}
                    />
                  </CardActionArea>
                  <CardContent>
                    <Typography>
                      {memory / 1024} GB/{vcpus} CPU
                    </Typography>
                    <Typography>{disk} GB SSD disk</Typography>
                    <Typography>{transfer} TB transfer</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SubTitle>Regions</SubTitle>
            <div className={classes.cardRoot}>
              {regions.map(({name, slug}) => (
                <Card
                  key={slug}
                  className={clsx(classes.card, slug === region && classes.cardSelected)}
                  onClick={() => setRegion(slug)}>
                  <CardActionArea className={classes.fillHeight}>
                    <CardHeader title={`${name.substring(0, name.length - 2)}`} />
                  </CardActionArea>
                </Card>
              ))}
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SubTitle>How many?</SubTitle>
              </Grid>
              <Grid item xs={6}>
                <SubTitle>Virtual Machines Names</SubTitle>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} container justify="center" spacing={1}>
                <Grid item>
                  <Button
                    className={classes.stepperButton}
                    variant="contained"
                    color="primary"
                    onClick={() => setEmails(emails.length > 1 ? emails.splice(0, emails.length - 1) : emails)}>
                    <RemoveIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <TextField value={emails.length} inputProps={{className: classes.stepperInput}} variant="outlined" />
                </Grid>
                <Grid item>
                  <Button
                    className={classes.stepperButton}
                    variant="contained"
                    color="primary"
                    onClick={() => setEmails(emails.length < 9 ? [...emails, {value: '', error: ''}] : emails)}>
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                {emails.map((email, index) => (
                  <TextField
                    key={index}
                    placeholder={`Name ${index + 1}`}
                    value={email.value}
                    className={classes.emailInput}
                    variant="outlined"
                    error={email.error !== ''}
                    fullWidth
                    onChange={event => {
                      let newEmails = emails.slice();
                      newEmails[index] = {value: event.target.value, error: ''};
                      setEmails(newEmails);
                    }}
                  />
                ))}
              </Grid>
            </Grid>
            {/*
            <SubTitle>Do you want to add some products to the VMs?</SubTitle>
            <div className={classes.cardRoot}>
              {Object.keys(products).map(productName => (
                <Card
                  key={productName}
                  className={clsx(
                    classes.card,
                    classes.productCard,
                  )}>
                  <CardHeader
                    title={productName}
                    className={classes.cardHeader}
                  />
                  <CardActions className={classes.justifyCenter}>
                    <Select
                      value={productsSelected[productName]}
                      displayEmpty
                    onChange={event => setProductsSelected({...productsSelected, [productName]: event.target.value})}>
                      <MenuItem value="">
                        Not added
                      </MenuItem>
                      {products[productName].map(({id, version}) => (
                        <MenuItem value={id} key={id}>
                          {version}
                        </MenuItem>
                      ))}
                    </Select>
                  </CardActions>
                </Card>
              ))}
            </div>
            */}

            <Button variant="contained" color="primary" style={{marginTop: 25}} onClick={submitVm}>
              Create VM
            </Button>
          </Paper>
        </Container>
      </main>
    </div>
  );
}
