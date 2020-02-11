export default theme => ({
    headerNavigation: {
        width: '100%',
        margin: '0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #e5e8ed',
        "& > div": {
            color: '#5b6987',
            margin: '0', 
            fontSize: '0.9em',
            padding: '5px 10px',
            "& > a:hover": {
                textDecoration: 'none',
                color: '#5b6987',
                cursor: 'pointer'
            }
        }
    },
    mainNavigation: {
        backgroundColor: '#ffffff',
        height: '65px',
        padding: '10px 30px',
        "& img": {
            width: '200px',
            height: '150px'
        },
        "& > ul": {
            listStyleType: 'none',
            padding: '0 auto',
            "& > li:first-child": {
                fontSize: '1.5em',
                marginTop: '-3px',
                marginRight: '65px',
                marginLeft: '-50px'
            },
            "& > li": {
                float: 'left',
                height: '50px',
                margin: '0px 20px',
            }
        }
    },
    menuTitle: {
        color: 'rgba(3,27,78,.7)',
        fontSize: '1.2em',
        "&:hover": {
            textDecoration: 'none',
            cursor: 'pointer',
            color: 'black'
        }
    },
    mainHeaderContent: {
        margin: '0 auto',
        minHeight: '600px',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no repeat',
        paddingTop: '50px',
        textAlign: 'center'
    
    },
    mainContent: {
        width: '80%',
        margin: '0 auto',
    },
    welcomeHeader: {
        fontSize: '52px',
        fontWeight: '600',
        color: '#fff'
    },
    welcomeParagraph: {
        fontSize: '24px',
        color: '#fff'
    },
    formSignUp: {
        margin: '0 auto',
        width: '90%'
    },
    btnSignUp: {
        margin: '20px auto'
    },
    mainFeatures: {
        width: '90%',
        margin: '0 auto',
        textAlign: 'center',
        "& h2": {
            width: '100%',
            textAlign: 'center'
        }
    },
    itemFeatures: {
        // backgroundColor: 'grey',
        height: '300px',
        margin: '3px auto',
        textAlign: 'left'
    }
});
