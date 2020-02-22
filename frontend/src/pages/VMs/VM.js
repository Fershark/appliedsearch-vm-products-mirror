import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Paper, Card, CardHeader, CardActions, Select, MenuItem, CardActionArea} from '@material-ui/core';

import {Drawer, Title, SubTitle, LoadingPage} from '../../components';
import {API_GET_VMS_DISTRIBUTIONS} from '../../config/endpoints-conf';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  distributionCard: {
    width: 160,
    textAlign: 'center',
    border: '1px solid rgb(103, 103, 103)',
    marginBottom: 10,
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
}));

export default function EditVM({appStyle, match, history}) {
  const {url} = match;
  const isEdit = url.split('/').pop() !== 'add';
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [distributions, setDistributions] = useState([]);
  const [distribution, setDistribution] = useState({});

  useEffect(() => {
    fetch(API_GET_VMS_DISTRIBUTIONS)
      .then(res => Promise.all([res.ok, res.json()]))
      .then(([okDistributions, resDistributions]) => {
        if (okDistributions) {
          const {name, data} = resDistributions[0];
          const {slug} = data[0];
          setDistribution({name, slug});
          setDistributions(resDistributions);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className={appStyle.root}>
      <LoadingPage open={loading} />
      <Drawer open={true} />
      <main className={appStyle.content}>
        <Container maxWidth="lg" className={appStyle.container}>
          <Paper className={appStyle.paper}>
            <Title>{isEdit ? 'Edit' : 'Add'} VM</Title>
            <SubTitle>Distributions</SubTitle>
            <div className={classes.cardRoot}>
              {distributions.map(({name, data}) => (
                <Card
                  key={name}
                  className={clsx(classes.distributionCard, name === distribution.name && classes.cardSelected)}>
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
          </Paper>
        </Container>
      </main>
    </div>
  );
}
