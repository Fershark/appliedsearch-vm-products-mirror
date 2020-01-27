const sideBarStyle = theme => ({
    root: {
        flexGrow: 1,
        padding: "0px auto !important",
        backgroundColor: "white"
    },
    paper: {
        padding: theme.spacing(0),
        margin: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    listItem: {
        margin: "0px auto !important",
        padding: "0px auto !important"
    },
    menuItem: {
        margin: "0px auto",
        padding: "0px auto",
        color: "rgba(0, 0, 0, 0.87)",
    },
    tag: {
        fontStyle: "italic",
        color: "#616161"
    }
  });
  
  export default sideBarStyle;