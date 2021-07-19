import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getProvinsi, getKabupaten, getKecamatan } from '../utils/fetchDataDaerah'

const useStyles = makeStyles({
  root: {
    "maxWidth": "16rem",
  },
  media: {
    "height" : "20vh"
  },
});

const EditDialog = ({dataToko}) => {
    const [open, setOpen] = useState(false)
    const [dataProvinsi, setDataProvinsi] = useState([])
    const [dataKabupaten, setDataKabupaten] = useState([])
    const [dataKecamatan, setDataKecamatan] = useState([])
    const [editField, setEditField] = useState(dataToko)

    useEffect(() => {
        const getAllDataBeg = async () => {
            const resProvinsi = await getProvinsi()
            const provId = 
                resProvinsi.filter(prov => (prov.nama) === (dataToko.provinsi))[0].id
            const resKabupaten = await getKabupaten(provId)
            const kabId = 
                resKabupaten.filter(kab => (kab.nama) === (dataToko.kabupaten))[0].id
            const resKecamatan = await getKecamatan(kabId)
            if(!(resProvinsi.error ||  resKabupaten.error ||  resKecamatan.error)){
                setDataProvinsi(resProvinsi)
                setDataKabupaten(resKabupaten)
                setDataKecamatan(resKecamatan)
                setEditField({...editField, provinsi: dataToko.provinsi, 
                    kabupaten: dataToko.kabupaten, kecamatan: dataToko.kecamatan})
            }
            else console.log(res.error)
        } 
        getAllDataBeg()
    },[open])

    const handleClickOpen = () => {
      setOpen(true)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    const handleOnProvinsiChange = async (event, val, reason) => {
        if(reason === "clear"){
            setEditField({...editField, provinsi: "", kabupaten: "", kecamatan: ""})
        }
        else if(val){
            const res = await getKabupaten(val.id)
            if(!res.error){
                setEditField({...editField, provinsi: val.nama, kabupaten : "", kecamatan : ""})
                setDataKabupaten(res)
            }
            else console.log(res.error)
        }
    }

    const handleOnKabupatenChange = async (event, val, reason) => {
        if(reason === "clear"){
            setEditField({...editField, kabupaten: "", kecamatan: ""})
        }
        else if(val){
            const res = await getKecamatan(val.id)
            if(!res.error){
                setEditField({...editField, kabupaten : val.nama, kecamatan : ""})
                setDataKecamatan(res)
            }
            else console.log(res.error)
        }
    }

    const handleOnKecamatanChange = (event, val) => {
        if(reason === "clear"){
            setEditField({...editField, kecamatan: ""})
        }
        else if(val){
            setEditField({...editField, kecamatan: val.nama})
        }
    }

    const handleEdit = () => {
        //check if there's a empty field
        //PUT to API
        //return notif if error
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
              Silahkan edit data toko dengan data yang benar.
            </DialogContentText>
            <TextField autoFocus 
                value={editField.nama}
                style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                fullWidth  variant="outlined"/>
            <Autocomplete
                value={{nama: editField.provinsi}}
                options={dataProvinsi}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnProvinsiChange}
                renderInput={(params) => <TextField {...params} autoFocus margin="dense" fullWidth label="Provinsi" variant="outlined" />}
            />
            <Autocomplete
                value={{nama: editField.kabupaten}}
                options={dataKabupaten}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKabupatenChange}
                renderInput={(params) => <TextField {...params} autoFocus margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
            />
            <Autocomplete
                value={{nama: editField.kecamatan}}
                options={dataKecamatan}
                getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                getOptionLabel={(option) => option.nama ? option.nama : ''}
                style={{ maxWidth: 400 }}
                onChange={handleOnKecamatanChange}
                renderInput={(params) => <TextField {...params} autoFocus margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
            />
            <TextField autoFocus 
                value={editField.jalan}
                style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                fullWidth  variant="outlined"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEdit} color="primary">
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}


const Toko = ({dataToko}) => {
    const classes = useStyles()

    return(
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={dataToko.gambar}
                    title={dataToko.nama}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {dataToko.nama}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Alamat : {dataToko.jalan},{dataToko.kecamatan},
                        {dataToko.provinsi}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" variant="outlined" color="primary">
                    Daftar Dorayaki
                </Button>
                <EditDialog dataToko={dataToko}/>
            </CardActions>
        </Card>
    )
}

export default Toko

