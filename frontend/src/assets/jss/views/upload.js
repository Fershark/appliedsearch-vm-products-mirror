const uploadStyle = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  uploadWrapper: {
    textAlign: 'center',
    backgroundColor: '#272C2F',
    borderRadius: '4px',
    padding: '0px',
    border: '5px dashed #C41502',
    height: '400px',
    color: '#999'
  },
  dropzone: {
    cursor: 'pointer',
	}
});
export default uploadStyle;