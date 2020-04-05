import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types"
import { getUserIdToken } from '../../services/firebase';
import {
  API_GET_VMS,
  API_GET_PRODUCTS,
} from '../../config/endpoints-conf';
import { Drawer, Title, MaterialTable, LoadingPage, ProductCards } from '../../components';
import {
  CircularProgress,
  Grid,
  Paper,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Divider,
  Button
} from '@material-ui/core/';

import { withStyles } from "@material-ui/core/styles"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}><Paper style={{ padding: 8, margin: 8 }}>{children}</Paper></Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

//access in side class with "this.props.classes". E.g: classes.root
const style = theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  section1: {
    margin: theme.spacing(1, 2)
  },
  section2: {
    margin: theme.spacing(1, 2)
  }
})

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1)
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none"
      }
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff"
    }
  },
  thumb: {
    width: 24,
    height: 24
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  )
})
class VMDetailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentTab: 0,
      vmInfo: {},
      products: {},
      vmProducts: {},
      disableOnOff: false,

    }
  }

  //fetch data
  componentDidMount() {

    const NUMBER_OF_JOBS = 2;
    let jobDone = 0;

    const doneJob = () => {
      if (++jobDone === NUMBER_OF_JOBS)
        this.setState({ loading: false })
    }

    //because useEffect cannot define as async
    const fetchVMInfo = async () => {
      //get token
      const token = await getUserIdToken();

      //fetch vm-detail
      const result = await fetch(
        API_GET_VMS + this.props.match.params.id, {
        headers: {
          Authorization: token,
        },
      });

      //convert to JSON
      const dropletInfo = await result.json();
      console.log('dropletInfo', dropletInfo)

      this.setState({
        vmInfo: dropletInfo
      })

      doneJob()
    }

    const fetchProducts = async () => {
      //fetch products
      const result = await fetch(API_GET_PRODUCTS);

      //convert to JSON
      const products = await result.json();
      console.log('products', products)

      this.setState({
        products: products
      })

      doneJob()
    }

    fetchProducts();
    fetchVMInfo();
  }

  //Handlers
  handleTabChange = (event, newValue) => {

    if (newValue === 0) {
      //because useEffect cannot define as async
      const fetchVMInfo = async () => {
        //get token
        const token = await getUserIdToken();

        //fetch vm-detail
        const result = await fetch(
          API_GET_VMS + this.props.match.params.id, {
          headers: {
            Authorization: token,
          },
        });

        //convert to JSON
        const dropletInfo = await result.json();
        console.log('dropletInfo', dropletInfo)

        this.setState({
          vmInfo: dropletInfo
        })
      }

      fetchVMInfo();
    }

    this.setState({
      currentTab: newValue
    })
  }

  handleProductActions = ({ type, product_id }) => {

    console.log({ type, product_id })
  }

  handleOnOffSwitchChange = async () => {

    this.setState({
      disableOnOff: true
    })

    const { id, status } = this.state.vmInfo;
    const actionType = status === "active" ? "power-off" : "power-on"

    //get token
    const token = await getUserIdToken();

    //create action
    const result = await fetch(API_GET_VMS + '/' + id + '/' + actionType, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    console.log(result)

    this.setState(prevState => ({
      disableOnOff: false,
      vmInfo: {
        ...prevState.vmInfo,
        status: status === "active" ? "off" : "active"
      }
    }))
  }

  render() {
    const { appStyle, match, history, classes } = this.props;
    const { id, name, image, status, networks, region, vcpus, memory, disk, created_at, products } = this.state.vmInfo;

    return (
      <React.Fragment>
        <div className={appStyle.root}>
          <Drawer />
          <main className={appStyle.content}>
            <AppBar position="static">
              <Tabs
                value={this.state.currentTab}
                onChange={this.handleTabChange}
                aria-label="simple tabs example"
              >
                <Tab label="VM Info" />
                <Tab label="Marketplace" />
              </Tabs>
            </AppBar>
            {
              this.state.loading
                ? <LoadingPage open={this.state.loading} />
                : <>
                  <TabPanel value={this.state.currentTab} index={0}>
                    <div className={classes.root}>
                      <div className={classes.section1}>
                        <Grid container alignItems="center">
                          <Grid item xs={8}>
                            <Typography gutterBottom variant="h3" color="primary">
                              {name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <>
                                  {this.state.disableOnOff
                                    ? <CircularProgress />
                                    : ""
                                  }
                                  <IOSSwitch
                                    checked={status === "active" ? true : false}
                                    onChange={this.handleOnOffSwitchChange}
                                    name="checkedB"
                                    disabled={this.state.disableOnOff}
                                  />
                                </>
                              }
                              label={
                                <Typography color={status === "active" ? "primary" : "error"} variant="h6">
                                  <Box fontWeight="fontWeightBold">
                                    {status === "active" ? "ON" : "OFF"}
                                  </Box>
                                </Typography>
                              }
                            />
                          </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                          <Grid item xs>
                            <Typography color="textSecondary" variant="subtitle1">
                              {`${image.distribution} ${image.name}`}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography color="textSecondary" variant="subtitle1">
                              {`created ${Math.round((Date.now()
                                - Date.parse(created_at)) / 60000)} minutes ago`}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography color="textSecondary" variant="subtitle1">
                              {`at ${region.name} data center`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <Divider variant="middle" />
                      <div className={classes.section2}>
                        <Grid container alignItems="center">
                          <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" color="secondary">
                              Size
                </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">VCPUs</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {vcpus}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">Memory</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {`${memory / 1024} GB`}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">Disk</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {`${disk} GB`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <Divider variant="middle" />
                      <div className={classes.section2}>
                        <Grid container alignItems="center">
                          <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" color="secondary">
                              Networking
                </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">IP address</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {networks.v4[0].ip_address}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">Gateway</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {networks.v4[0].gateway}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">Netmask</Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                              {networks.v4[0].netmask}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <Divider variant="middle" />
                      <div className={classes.section2}>
                        <Grid container alignItems="center">
                          <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" color="secondary">
                              Products
                </Typography>
                          </Grid>
                          {(Object.keys(products).length === 0 && products.constructor === Object)
                            ? <Grid item xs>
                              <Typography variant="h6" align="center">Looks like you don’t have any Products.</Typography>
                              <Typography color="textSecondary" variant="subtitle1" align="center">
                                Fortunately, it’s very easy to install one.
                </Typography>
                              <Button variant="contained" color="primary" style={{ display: 'block', margin: "0 auto" }}>
                                Add Product
                </Button>
                            </Grid>
                            : <Grid item xs>
                              <ProductCards
                                products={this.state.products}
                                handleProductActions={this.handleProductActions}
                                vmId={id}
                                productsInVM={products}
                                displayAll={false}
                              />
                            </Grid>
                          }
                        </Grid>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={this.state.currentTab} index={1}>
                    <ProductCards
                      products={this.state.products}
                      handleProductActions={this.handleProductActions}
                      vmId={id}
                      productsInVM={products}
                      displayAll={true}
                    />
                  </TabPanel>
                </>
            }
          </main>
        </div>
      </React.Fragment>
    )
  }
}
export default withStyles(style)(VMDetailPage)