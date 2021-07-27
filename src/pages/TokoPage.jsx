import React, {useEffect, useState} from 'react'
import Toko from '../components/Toko'
import { Grow, Paper, IconButton, InputBase, Divider, Collapse, Box, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getProvinsi, getKabupaten, getKecamatan } from '../utils/fetchDataDaerah'
import AddIcon from '@material-ui/icons/Add';
import useQuery from '../utils/useQuery'
import { useLocation, useHistory } from 'react-router-dom'
import { API_BASE_URL } from '../utils/config'
import axios from 'axios'

const searchBarStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      margin: '0rem auto',
      display: 'flex',
      alignItems: 'center',
      maxWidth: '400px',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

      
const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap",
    "minHeight" : "60vh"
}

const AddDialog = ({syncDataTokos, notif, setNotif}) => {
    const [open, setOpen] = useState(false)
    const [addField, setAddField] = useState({})
    const [dataDaerah, setDataDaerah] = useState({"provinsi" : [], "kabupaten" : [], "kecamatan" : []})
    const [addOps, setAddOps] = useState(false)
    

    const handleClickOpen = () => {
        setOpen(true)
      }
    
    const handleClose = () => {
        setOpen(false)
        setAddField({nama: "", provinsi: "", kabupaten: "", kecamatan: "", jalan: ""})
    }

    useEffect(() => {
        const fetchDataProvinsi = async () => {
            const resProvinsi = await getProvinsi()
            setDataDaerah({...dataDaerah, "provinsi" : resProvinsi})
            setAddField({nama: "", provinsi: "", kabupaten: "", kecamatan: "", jalan: ""})
        }
        fetchDataProvinsi()
    }, [open])

    const handleOnProvinsiChange = async (event, val, reason) => {
        if(reason === "clear"){
            setAddField({...addField, provinsi: "", kabupaten: "", kecamatan: ""})
        }
        else if(val){
            try{
                const res = await getKabupaten(val.id)
                setAddField({...addField, provinsi: val.nama, kabupaten : "", kecamatan : ""})
                setDataDaerah({...dataDaerah, "kabupaten": res})
            }catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKabupatenChange = async (event, val, reason) => {
        if(reason === "clear"){
            setAddField({...addField, kabupaten: "", kecamatan: ""})
        }
        else if(val){
            try{
                const res = await getKecamatan(val.id)
                setAddField({...addField, kabupaten : val.nama, kecamatan : ""})
                setDataDaerah({...dataDaerah, "kecamatan": res})
            }catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
    }

    const handleOnKecamatanChange = (event, val, reason) => {
        if(reason === "clear"){
            setAddField({...addField, kecamatan: ""})
        }
        else if(val){
            setAddField({...addField, kecamatan: val.nama})
        }
    }
    
    const checkAddFieldChanged = () => {
        return !(
            addField.nama === "" &&
            addField.provinsi === "" &&
            addField.kabupaten === "" &&
            addField.kecamatan === "" &&
            addField.jalan  === "" &&
            !(addField.pngFile)
        )
    }
    const handleAdd = async () => {
        setAddOps(true)
        try{
            const addURL = API_BASE_URL + `/toko-dorayakis/`
            const {nama, jalan, kabupaten, kecamatan, provinsi, pngFile} = addField

            const formData = new FormData()
            if(nama) formData.append("nama", nama)
            if(jalan) formData.append("jalan", jalan)
            if(kabupaten) formData.append("kabupaten", kabupaten)
            if(kecamatan) formData.append("kecamatan", kecamatan)
            if(provinsi) formData.append("provinsi", provinsi)
            if(pngFile) formData.append("gambar", pngFile)

            await axios.post(addURL, formData)
            await syncDataTokos()
            setNotif({...notif, open: true, type: "success", msg: "toko berhasil ditambahkan!"})
            setOpen(false)
        }catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
        finally{
            setAddOps(false)
        }
    }

    return(
        <div style={{display: "grid", "maxWidth" : "7rem",  margin: "1rem auto"}}>
            <Button size="small" variant="contained" color="primary"
                startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add Toko
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Toko</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Silahkan tambahkan toko dengan data yang benar.
                </DialogContentText>
                <TextField autoFocus 
                    value={addField.nama}
                    style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, "nama" : e.target.value})}
                />
                <Autocomplete
                    value={{nama: addField.provinsi}}
                    options={dataDaerah["provinsi"]}
                    getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                    getOptionLabel={(option) => option.nama ? option.nama : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnProvinsiChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Provinsi" variant="outlined" />}
                />
                <Autocomplete
                    value={{nama: addField.kabupaten}}
                    options={dataDaerah["kabupaten"]}
                    getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                    getOptionLabel={(option) => option.nama ? option.nama : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnKabupatenChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
                />
                <Autocomplete
                    value={{nama: addField.kecamatan}}
                    options={dataDaerah["kecamatan"]}
                    getOptionSelected={(option, value) => value.nama ? (option.nama === value.nama) : true}
                    getOptionLabel={(option) => option.nama ? option.nama : ''}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnKecamatanChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
                />
                <TextField
                    value={addField.jalan} 
                    style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, "jalan" : e.target.value})}
                />
                <div>
                    Gambar
                    <div style={{display: "grid"}}> 
                        <input
                            accept="image/png"
                            type="file"
                            onChange={(e) => setAddField({...addField, pngFile: e.target.files[0]})}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                {
                    !addOps
                        ?
                        checkAddFieldChanged()
                            ?
                                <Button onClick={handleAdd} variant="contained" color="primary" autoFocus>
                                    Add
                                </Button> 
                            :
                                <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
                                    Add
                                </Button> 
                        : 
                            <Button onClick={handleAdd} disabled variant="contained" color="primary" autoFocus>
                                <CircularProgress size={20}/> Adding...
                            </Button>
                }
            </DialogActions>
            </Dialog>
      </div>
    )
}



const TokoPage = ({dataTokos, syncDataTokos, notif, setNotif}) => {
    const history = useHistory()
    const location = useLocation()
    const currLocation = location.pathname
    let query = useQuery()

    /* Handle Search Query */
    let filteredToko = [...dataTokos]
    let currSearchQuery = (query.get("q") || "").trim()
    let currStateSetting = { nama: true, jalan: false, kecamatan: false, kabupaten: false, provinsi: false }
    const settingSearchAttribute = ["nama", "jalan", "kecamatan", "kabupaten", "provinsi"]

    if(currSearchQuery.length != 0){
        const searchMethods = (query.get("sm") || "").trim().split('|').map(met => met.trim()).filter(q => settingSearchAttribute.includes(q))
        if(searchMethods.length != 0){
            currStateSetting["nama"] = false
            let tmpFilteredToko = []
            for(const searchMethod of searchMethods){
                currStateSetting[searchMethod] = true
                tmpFilteredToko = tmpFilteredToko.concat(filteredToko.filter(toko => toko[searchMethod].toLowerCase().includes(currSearchQuery.toLowerCase())))
            }
            filteredToko = tmpFilteredToko
        }
    }
    
    const [searchQuery, setSearchQuery] = useState(currSearchQuery)
    const [stateSetting, setStateSetting] = useState(currStateSetting)
    const handleChangeSetting = (event) => {
        setStateSetting({ ...stateSetting, [event.target.name]: event.target.checked });
    }
    const [settingButton, setSettingButton] = useState(true)
    const handleSetting = () => setSettingButton(!settingButton)

    const searchBarClasses = searchBarStyles()

    const handleSearch = () => {
        let searchMethods = []
        for(const setting of settingSearchAttribute){
            if(stateSetting[setting]) searchMethods.push(setting)
        }
        if(searchMethods.length != 0){
            searchMethods = searchMethods.join('|')
            history.push(currLocation+`?q=${searchQuery}`+`&sm=${searchMethods}`)            
        }
        else{
            setNotif({...notif, open: true, type: "error", msg: "setting method must be provided"})
        }
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        handleSearch()
    }

    const changeRoute = (route) => {
        history.push(route)
    }

    return (
        <>
            <Paper component="form" onSubmit={handleSearchSubmit} className={searchBarClasses.root}>
                <InputBase
                    className={searchBarClasses.input}
                    placeholder="Cari Toko Dorayaki"
                    inputProps={{ 'aria-label': 'cari toko dorayaki' }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
                <IconButton onClick={handleSearch} className={searchBarClasses.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider className={searchBarClasses.divider} orientation="vertical" />
                {
                    settingButton ?
                        <IconButton  color="primary" className={searchBarClasses.iconButton} onClick={handleSetting} aria-label="settings">
                            <SettingsIcon />
                        </IconButton> :
                        <IconButton  color="primary" className={searchBarClasses.iconButton} onClick={handleSetting} aria-label="settings">
                            <CloseIcon />
                        </IconButton> 
                }
            </Paper>
            <AddDialog syncDataTokos={syncDataTokos} notif={notif} setNotif={setNotif}/>
            <Collapse in={!settingButton}>
                    <Paper style={{margin: "1rem"}}>
                        <Box textAlign="center" fontWeight="fontWeightBold" fontSize="h6.fontSize">Pencarian Toko Berdasarkan:</Box>
                        <Divider orientation="horizontal" />
                        <FormGroup row style={{marginLeft: "1rem"}}>
                            {
                                settingSearchAttribute.map((atr, idx) => (
                                    <FormControlLabel key={idx}
                                        control={
                                            <Switch
                                                key={idx}
                                                checked={stateSetting[atr]}
                                                onChange={handleChangeSetting}
                                                name={atr}
                                                color="primary"
                                            />
                                        }
                                        label={atr[0].toUpperCase() + atr.substr(1,)}
                                    />
                                ))
                            }
                            
                        </FormGroup>
                        <Divider orientation="horizontal" />

                    </Paper>
            </Collapse>
            {
                <div style={stylesPar}>
                    {
                        filteredToko.map((toko, idx) => (
                            <div key={idx}>
                                <Grow in={true} key={idx} timeout={500 + 100*idx}>
                                    <Paper elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                        <Toko key={idx} dataToko={toko} 
                                            syncDataTokos={syncDataTokos}
                                            notif={notif}
                                            setNotif={setNotif}
                                            changeRoute={changeRoute}
                                        />
                                    </Paper>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            } 
        </>
    )
}

export default TokoPage