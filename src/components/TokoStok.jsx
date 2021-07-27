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

const TokoStok = ({dataTokoStok, notif, setNotif, syncDataStokToko}) => {
    const classes = useStyles()
    const [stokField, setStokField] = useState(false)
    const [editOps, setEditOps] = useState(false)
    const [stokFieldVal, setStokFielVal] = useState(dataTokoStok.stok)

    const handleEditStok = async () => {
        if(!stokField){
            setStokField(true)
        }
        else{
            try{
                setEditOps(true)
                const stokEditURL = API_BASE_URL + `/stok-dorayakis/${dataTokoStok._id}` 
                const tes = await axios.put(stokEditURL, {stok: stokFieldVal})
                setEditOps(false)
                setStokField(false)
                setNotif({...notif, open: true, type: "success", msg: "stok dorayaki berhasil diupdate"})
                await syncDataStokToko
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
                        value: stokFieldVal,
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem", marginLeft: "1rem"}}
                    onChange={(e) => setStokFielVal(e.target.value)}
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
        </Card>
    )
}

export default TokoStok