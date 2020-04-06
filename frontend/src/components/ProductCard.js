import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Divider
} from "@material-ui/core"

import {
  API_CREATE_ACTION
} from '../config/endpoints-conf';

import { getUserIdToken } from '../services/firebase';

const useStyles = makeStyles({
  root: {
    margin: 8,
    marginTop: 24,
    marginBottom: 16,
    padding: 8,
    minWidth: 300,
    maxWidth: 300
  },
  media: {
    height: 140
  }
})

const ProductStatus = {
  INSTALLING: "installing",
  UNINSTALLING: "uninstalling",
  ERRORED: "errored",
  INSTALLED: "installed",
  NONE: null
}

const ActionType = {
  INSTALL: "Install",
  UNINSTALL: "Uninstall"
}

const ActionStatus = {
  NEW: "new",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  ERRORED: "errored"
}

export default function ProductCard({
  product,
  vmId,
  productsInVM
}) {

  //PROPS
  console.log({ product, productsInVM })
  const productName = product[0];
  const details = product[1];

  //Check this is in productsInVM
  let initialAddedProduct = null;
  details.forEach(p => {
    if (productsInVM[p.id] != undefined) {
      initialAddedProduct = {
        id: p.id,
        description: p.description,
        version: p.version,
        status: productsInVM[p.id].status
      }
    }
  });

  //STATES
  const [productId, setProductId] =
    useState(details[0].id)
  const [addedProduct, setAddedProduct] =
    useState(initialAddedProduct)

  // HANDLERS
  const handleSelectChange = (event) => {
    setProductId(event.target.value);
  };

  const handleProductActionClick = () => {
    console.log({ productId, addedProduct });

    //disable UIs
    // setStatus(ProductStatus.INSTALLING)

    const NUMBER_OF_JOBS = 1;
    let jobDone = 0;

    const doneJob = () => {
      // if (++jobDone === NUMBER_OF_JOBS)   
      //   this.setState({loading: false})
    }

    const createAction = async () => {
      //get token
      const token = await getUserIdToken();

      let type = null, id = null

      if (addedProduct === null || addedProduct.status === ProductStatus.INSTALLING) {
        type = ActionType.INSTALL;
        id = productId
      } else {
        type = ActionType.UNINSTALL;
        id = addedProduct.id
      }


      //create action
      const result = await fetch(API_CREATE_ACTION, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          "vm_id": vmId,
          "type": type.toLowerCase(),
          "product": id
        })
      });

      //convert to JSON
      const action = await result.json();
      console.log('action', action)

      if (action["vm-products"] != null) {//success

        productsInVM = action["vm-products"].products

        details.forEach(p => {
          if (productsInVM[p.id] != undefined) {
            console.log(productsInVM[p.id])
            setAddedProduct({
              id: p.id,
              description: p.description,
              version: p.version,
              status: productsInVM[p.id].status
            })
          }
        });

      }

      doneJob()
    }

    createAction();
  };

  //STYLES
  const classes = useStyles()

  return (<Grid item xs component={Card} key={productName.replace(/ /g, "-")} className={classes.root}>
    {/* <Card className={classes.root}> */}
    {console.log({ initialAddedProduct })}
    <Grid container spacing={0}
      direction="column"
      style={{ height: "100%" }}
    >
      <Grid item xs >
        <CardContent>
          <Typography gutterBottom variant="h5" color="primary">
            {addedProduct === null
              ? productName
              : productName + " " + addedProduct.version}
          </Typography>
          <Divider />
          <Typography gutterBottom variant="body1">
            {details[0].description}
          </Typography>
          <Divider />
        </CardContent>
      </Grid>

      <Grid item>
        <CardActions>
          <Grid container spacing={1}
            direction="row"
            justify="flex-start"
            alignItems="flex-start">
            <Grid item xs>
              {addedProduct === null
                ? <FormControl variant="outlined" size="small" style={{ width: "95%" }}>
                  <InputLabel htmlFor="outlined-age-native-simple">Version</InputLabel>
                  <Select
                    native
                    value={productId}
                    onChange={handleSelectChange}
                    label="Version"
                    disabled={addedProduct !== null && (addedProduct.status === ProductStatus.INSTALLING || addedProduct.status === ProductStatus.UNINSTALLING)}
                  >
                    {details.map(({ id, description, version }) => {
                      return (
                        <option value={id} key={id}> {version} </option>
                      )
                    })}
                  </Select>
                </FormControl>
                : <Typography gutterBottom variant="h6" color="secondary" >
                  {addedProduct.status.toUpperCase()}
                </Typography>
              }
            </Grid>
            <Grid item>
              <Button size="small" color="primary" variant="contained" size="medium"
                onClick={handleProductActionClick}
                disabled={addedProduct !== null && (addedProduct.status === ProductStatus.INSTALLING || addedProduct.status === ProductStatus.UNINSTALLING)}
              >
                {addedProduct === null || addedProduct.status === ProductStatus.INSTALLING
                  ? ActionType.INSTALL
                  : ActionType.UNINSTALL
                }
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Grid>
    </Grid>
  </Grid>
  )
}
