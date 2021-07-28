import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import { API_BASE_URL } from '../utils/config'
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import axios from 'axios';
const useStyles = makeStyles({
    root: {
        width: "25vh"
    },
    media: {
        height: 0,
        paddingTop: '100%'
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    }
});

const useStyleFullScreen = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
        width: '100%',
      },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    details: {
        flexDirection: "column"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MoveDorayakiDialog = ({dataTokos, dataTokoStok, syncDataTokoStok, setStokFieldVal, notif, setNotif}) => {
    const classes = useStyleFullScreen();
    const [open, setOpen] = React.useState(false);
    const [moveField, setMoveField] = useState(0);
    const [moveOps, setMoveOps] = useState(false);
    const currToko = dataTokos.filter(dataToko => dataToko._id === dataTokoStok.tokoDorayaki)[0] || dataTokos[0]
    
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    

    const handleMoveStok = async (idOrigin) => {
        setMoveOps(true)
        try{
            //fetch stok, with constraint, idDorayaki = dataTokoStok.dorayaki._id, idToko = idOrigin
            const stokOrigin = 
                (await axios.get(API_BASE_URL + `/stok-dorayakis/?dorayakiId=${dataTokoStok.dorayaki._id}&tokoDorayakiId=${idOrigin}`)).data[0]
            
            await axios.put(API_BASE_URL + `/stok-dorayakis/${dataTokoStok._id}`, {stok: dataTokoStok.stok-parseInt(moveField)})
            await axios.put(API_BASE_URL + `/stok-dorayakis/${stokOrigin._id}`, {stok: stokOrigin.stok+parseInt(moveField)})
            await syncDataTokoStok()
            setNotif({...notif, open: true, type: "success", msg: "stok dorayaki berhasil di pindahkan"})
            setOpen(false)
            setStokFieldVal(dataTokoStok.stok-parseInt(moveField))
        } catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
        finally{
            setMoveOps(false)
        }
    }

    return (
      <div>
        <Button size="small"
         variant="outlined" color="primary" 
         style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
         onClick={handleClickOpen}>
          Pindahkan Stok
        </Button>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Pindahkan Stok Dorayaki
              </Typography>
            </Toolbar>
          </AppBar>
        <div style={{display: "flex", flexDirection:"column", margin: "1rem auto"}}>
                <TextField
                    id="filled-number"
                    label="Jumlah Pemindahan"
                    type="number"
                    InputProps={{
                        value: moveField,
                        inputProps:{
                            min: 0,
                            max: dataTokoStok.stok
                        }
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem"}}
                    onChange={(e) => setMoveField(e.target.value)}
                />
                <Typography><strong>Maximum pemindahan: </strong>{dataTokoStok.stok} stok</Typography>
                <Typography><strong>Toko asal: </strong> Toko {currToko.nama} </Typography>
                <Typography><strong>Dorayaki dipindah: </strong> Dorayaki {dataTokoStok.dorayaki.rasa} </Typography>
        </div>
        <div style={{margin: "1rem"}}>
            <strong>Pindahkan ke Toko: </strong>
            {
                dataTokos.filter(dataToko => (dataToko._id !== dataTokoStok.tokoDorayaki)).
                map((dataToko, key) => {
                    return (
                        <Accordion key={key}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                key={key}
                                >
                                <Typography className={classes.heading}>Toko {dataToko.nama}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.details}>
                            {
                                moveOps ?
                                    <Button size="small"
                                        disabled
                                        variant="outlined" color="primary" 
                                        style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
                                        >
                                         <CircularProgress size={20}/>  Memindahkan...
                                    </Button>
                                :
                                    <Button size="small"
                                        variant="outlined" color="primary" 
                                        style={{margin: "0 auto", display: "flex", marginBottom: "0.5rem"}}
                                        onClick={() => handleMoveStok(dataToko._id)}>
                                        Pindahkan ke Toko Ini
                                    </Button>
                            }
                                <Typography><strong>Alamat Toko</strong></Typography>
                                <br/>
                                <Typography><strong>Jalan: </strong> {dataToko.jalan}</Typography>
                                <Typography><strong>Kecamatan: </strong>{dataToko.kecamatan}</Typography>
                                <Typography><strong>Kabupaten: </strong> {dataToko.kabupaten}</Typography>
                                <Typography><strong>Provinsi: </strong> {dataToko.provinsi}</Typography>
                            </AccordionDetails>
                        </Accordion>        
                    )
                })
            }
        </div>
        </Dialog>
      </div>
    );
}

const TokoStok = ({dataTokos, dataTokoStok, notif, setNotif, syncDataTokoStok}) => {
    const classes = useStyles()
    const [stokField, setStokField] = useState(false)
    const [editOps, setEditOps] = useState(false)
    const [stokFieldVal, setStokFieldVal] = useState(dataTokoStok.stok)

    const handleEditStok = async () => {
        if(!stokField){
            setStokField(true)
        }
        else{
            try{
                setEditOps(true)
                const stokEditURL = API_BASE_URL + `/stok-dorayakis/${dataTokoStok._id}` 
                await axios.put(stokEditURL, {stok: stokFieldVal})
                setEditOps(false)
                setStokField(false)
                setNotif({...notif, open: true, type: "success", msg: "stok dorayaki berhasil diupdate"})
                await syncDataTokoStok()
            } catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
    }

    return(
        <Card className={classes.root}>
            <div style={{height: "33vh"}}>
                <CardMedia
                    className={classes.media}
                    image={API_BASE_URL + dataTokoStok.dorayaki.gambar}
                    title={dataTokoStok.dorayaki.nama}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Dorayaki {dataTokoStok.dorayaki.rasa}
                    </Typography>
                </CardContent>
            </div>
            <div style={{display:"flex", justifyContent: "space-between"}}>
                <TextField
                    id="filled-number"
                    label="Stok Dorayaki"
                    type="number"
                    InputProps={{
                        disabled: !stokField,
                        value: stokFieldVal
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem", marginLeft: "1rem"}}
                    onChange={(e) => setStokFieldVal(e.target.value)}
                />
                <Fab
                    style={{marginRight: "1rem", marginBottom: "1rem"}}
                    size="small"
                    aria-label="save"
                    color="primary"
                    onClick={handleEditStok}
                    >
                    {stokField ? <SaveIcon /> : <EditIcon />}
                    {editOps && <CircularProgress size={50} className={classes.fabProgress} />}
                </Fab>
            </div>
            <div>
                {
                    (dataTokos.length !== 0) &&
                        <MoveDorayakiDialog syncDataTokoStok={syncDataTokoStok} dataTokos={dataTokos} 
                            dataTokoStok={dataTokoStok}
                            notif={notif}
                            setNotif={setNotif}
                            setStokFieldVal={setStokFieldVal}/>
                }
            </div>
        </Card>
    )
}

export default TokoStok