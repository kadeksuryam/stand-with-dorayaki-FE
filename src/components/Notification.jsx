import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const Notification = ({notif, setNotif}) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return
    }
    setNotif({...notif, open: false})
  }

  return (
    <div className={classes.root}>
      <Snackbar open={notif.open} autoHideDuration={3000} onClose={handleClose}
         anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity={notif.type}>
          {notif.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notification