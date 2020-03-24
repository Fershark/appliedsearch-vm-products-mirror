import React from "react"
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

export default function ProductCard({products}) {
  const classes = useStyles()

  //convert object to array
  products = Object.entries(products)

  console.log("Products", products);

  return (<>
    <Grid container
    direction="row"
    justify="center"
    alignItems="stretch">

      {products.map(([productName, details]) => {
        
      return (<Grid item xs component={Card} key={productName.replace(/ /g, "-")} className={classes.root}>
        {/* <Card className={classes.root}> */}
      
      <Grid container spacing={0} 
        direction="column"
        style={{height: "100%"}}
      >
        <Grid item xs>
        <CardContent>
         {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="Contemplative Reptile"
      /> */}
       <Typography gutterBottom variant="h5" color="primary">
          {productName}
        </Typography>
        <Divider />
        <Typography gutterBottom variant="body1">
          {details[0].description}
        </Typography>
        <Divider/>
      </CardContent>
        </Grid>

        <Grid item>
          <CardActions>
        <Grid container spacing={1} 
        direction="row"
        justify="flex-start"
        alignItems="flex-start">
          <Grid item xs>
          <FormControl variant="outlined" size="small" style={{width: "95%"}}>
            <InputLabel htmlFor="outlined-age-native-simple">Version</InputLabel>
            <Select
              native
              // value={state.age}
              // onChange={handleChange}
              label="Version"
              // inputProps={{
              //   name: "Version",
              //   id: "outlined-age-native-simple"
              // }}
            >
              {details.map(({id, description, version}) => {
                return (
                <option value={id}> {version} </option>
                )
              })}
            </Select>
          </FormControl>
          </Grid>
          <Grid item>
          <Button size="small" color="primary" variant="contained" size="medium">
            Install
          </Button>
          </Grid>
        </Grid>
          
          
            </CardActions>
        </Grid>

      </Grid>

          {/* </Card> */}
        </Grid>
      )
    }
      )}

      </Grid>
    </>
  )
}
