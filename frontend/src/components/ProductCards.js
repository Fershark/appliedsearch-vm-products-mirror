import React from "react"
import {
  Grid
} from "@material-ui/core"
import ProductCard from "./ProductCard"

export default function ProductCards({
  products,
  handleTabChange,
  vmId,
  productsInVM,
  displayAll
}) {

  let vmProducts = [];

  if (displayAll) {//filter other products
    //convert object to array
    products = Object.entries(products)
  } else {
    Object.entries(productsInVM).forEach(([id, detail]) => {
      vmProducts.push([detail.name, products[detail.name]])
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
          productsInVM={productsInVM}
          displayAll={displayAll}
          handleTabChange={handleTabChange}
        />
      })}

    </Grid>
  </>
  )
}
