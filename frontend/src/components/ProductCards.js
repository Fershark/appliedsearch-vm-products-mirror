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
import ProductCard from "./ProductCard"

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

export default function ProductCards({
  products,
  handleProductActions,
  vmId,
  productsInVM,
  displayAll
}) {

  let vmProducts = [];
  
  if(displayAll){//filter other products
    //convert object to array
    products = Object.entries(products)
  }else{
    Object.entries(productsInVM).forEach(([id, detail]) => {
      vmProducts.push([detail.name , products[detail.name]])
    });
    products = vmProducts
  }

  console.log("Products", products);

  return (<>
    <Grid container
      direction="row"
      justify="center"
      alignItems="stretch">

      {products.map(product => {

        return <ProductCard product={product}
          vmId={vmId}
          productsInVM={productsInVM} />
      }
      )}

    </Grid>
  </>
  )
}
