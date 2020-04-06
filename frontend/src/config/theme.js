import {createMuiTheme} from '@material-ui/core/styles';
import {teal, amber} from '@material-ui/core/colors/';

export default createMuiTheme({
  palette: {
    primary: {main: "#2196F3"},
    secondary: {main: "#1287B9"},
  },
  overrides: {
    MuiLinearProgress: {
      root: {
        height: '10px',
        overflow: 'hidden',
        position: 'relative',
      }
    }
  }
});
