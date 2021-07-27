import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getProvinsi, getKabupaten, getKecamatan } from '../utils/fetchDataDaerah'
import { API_BASE_URL } from '../utils/config'
import axios from 'axios'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
  root: {
     width: "25vh"
  },
  media: {
    height: 0,
    paddingTop: '100%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const EditDialog = ({dataDorayaki, syncDataDorayakis, notif, setNotif}) => {
    const [open, setOpen] = useState(false)
    const [editField, setEditField] = useState(dataDorayaki)
    const [updateOps, setUpdateOps] = useState(false)

    const handleClickOpen = () => {
      setOpen(true)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    const handleEdit = async () => {
        setUpdateOps(true)
        try{
            const updateURL = API_BASE_URL + `/dorayakis/${dataDorayaki._id}`
            const {rasa, deskripsi, pngFile} = editField
            let formData = new FormData()
            if(rasa) formData.append("rasa", rasa)
            if(deskripsi) formData.append("deskripsi", deskripsi)
            if(pngFile) formData.append("gambar", pngFile)
            
            await axios.put(updateURL, formData)
            await syncDataDorayakis()

            setNotif({...notif, open: true, type: "success", msg: "dorayaki berhasil diupdate"})
            setOpen(false)
        }catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
        finally{
            setUpdateOps(false)
        }
    }

    const checkEditFieldChanged = () => {
        return !(
            dataDorayaki.rasa === editField.rasa &&
            dataDorayaki.deskripsi === editField.deskripsi &&
            !(editField.pngFile)
        )
    }

    
    return (
      <div>
        <Button size="small" variant="contained" color="primary"
            startIcon={<EditIcon />} onClick={handleClickOpen}>
          Edit
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Toko</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Silahkan edit data dorayaki dengan data yang benar.
            </DialogContentText>
            <form></form>
            <TextField autoFocus 
                value={editField.rasa}
                style={{ maxWidth: 400 }} margin="dense" label="rasa" type="text" 
                fullWidth  variant="outlined"
                onChange={(e) => setEditField({...editField, rasa : e.target.value})}
            />
            <TextField
                label="deskripsi"
                style={{ maxWidth: 400 }}
                type="text" margin="dense" multiline
                fullWidth  variant="outlined"
                aria-label="empty textarea"
                value={editField.deskripsi}
                onChange={(e) => setEditField({...editField, deskripsi : e.target.value})}
                placeholder="deksripsi dorayaki" />
            <div>
                Gambar
                <div style={{display: "grid"}}> 
                    <input
                        accept="image/png"
                        type="file"
                        onChange={(e) => setEditField({...editField, pngFile: e.target.files[0]})}
                    />
                </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            {
                !updateOps
                    ?
                    checkEditFieldChanged()
                        ?
                            <Button onClick={handleEdit} variant="contained" color="primary" autoFocus>
                                Update
                            </Button> 
                        :
                            <Button onClick={handleEdit} disabled variant="contained" color="primary" autoFocus>
                                Update
                            </Button> 
                    : 
                        <Button onClick={handleEdit} disabled variant="contained" color="primary" autoFocus>
                            <CircularProgress size={20}/> Updating...
                        </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    )
}

const DeleteDialog = ({dataDorayaki, syncDataDorayakis, notif, setNotif}) => {
    const [open, setOpen] = useState(false)
    const [deleteOps, setDeleteOps] = useState(false)


    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        setDeleteOps(true)
        try{
            const deleteURL = API_BASE_URL + `/dorayakis/${dataDorayaki._id}`
            await axios.delete(deleteURL)
            setNotif({...notif, open: true, type: "success", msg: "dorayaki berhasil dihapus"})
            setOpen(false)
            await syncDataDorayakis()
        }catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
    }
    return (
        <div>
            <Button size="small" variant="contained" style={{backgroundColor: "#bf360c", color: 'inherit'}}
                startIcon={<DeleteIcon />} onClick={handleClickOpen}>
                    Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Delete Dorayaki ${dataDorayaki.rasa}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Penghapusan dorayaki akan berdampak dihapusnya semua stok dorayaki tersebut.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    {
                        !deleteOps
                        ?
                            <Button onClick={handleDelete} variant="contained" style={{backgroundColor: "#bf360c"}} autoFocus>
                                Delete
                            </Button>
                        : 
                            <Button onClick={handleDelete} disabled variant="contained" style={{color: "#bf360c"}} autoFocus>
                                <CircularProgress size={20}/> Deleting...
                            </Button>
                    }
                </DialogActions>
            </Dialog>
      </div>
    )
}

const Dorayaki = ({dataDorayaki, syncDataDorayakis, notif, setNotif}) => {
    const classes = useStyles()

    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = () => setShowDetails(!showDetails)

    return(
        <Card className={classes.root}>
            <div style={{height: "30vh"}}>
                <CardMedia
                    className={classes.media}
                    image={API_BASE_URL + dataDorayaki.gambar}
                    title={dataDorayaki.rasa}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Dorayaki {dataDorayaki.rasa}
                    </Typography>
                </CardContent>
            </div>
            <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                <EditDialog dataDorayaki={dataDorayaki}  syncDataDorayakis={syncDataDorayakis}
                    notif={notif} setNotif={setNotif}/>
                <DeleteDialog dataDorayaki={dataDorayaki} syncDataDorayakis={syncDataDorayakis}
                    notif={notif} setNotif={setNotif}/>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: showDetails,
                    })}
                    onClick={handleShowDetails}
                    aria-expanded={showDetails}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={showDetails} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography><strong>Details</strong></Typography>
                    <br/>
                    <Typography><strong>Rasa: </strong> <br/>{dataDorayaki.rasa}</Typography>
                    <Typography><strong>Deskripsi: </strong><br/>{dataDorayaki.deskripsi}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default Dorayaki

