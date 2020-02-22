import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function SubTitle({children}) {
  return (
    <Typography component="h3" variant="subtitle1" color="secondary" gutterBottom>
      {children}
    </Typography>
  );
};
