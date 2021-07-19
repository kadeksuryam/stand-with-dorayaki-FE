import React, {useEffect, useState} from 'react'
import Toko from '../components/Toko'
import { Pagination } from '@material-ui/lab'
import { Grow, Paper, IconButton, InputBase, Divider, Collapse, Box, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
const searchBarStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      margin: '1rem auto',
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


const AddDialog = () => {
    const [open, setOpen] = useState(false)
    const [addField, setAddField] = useState({})
    const [dataDaerah, setDataDaerah] = useState({"provinsi" : [], "kabupaten" : [], "kecamatan" : []})

    const handleClickOpen = () => {
        setOpen(true)
      }
    
    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        const fetchDataProvinsi = async () => {
            const resProvinsi = await getProvinsi()
            setDataDaerah({...dataDaerah, "provinsi" : resProvinsi})
        }
        fetchDataProvinsi()
    }, [])

    const handleOnDataDaerahChange = async (event, val, reason) => {
        const inputId = (event.target.id)
        const key = inputId.substr(0,(inputId).indexOf("-option-"))
        if(key === "provinsi"){
            if(reason === "clear"){
                setAddField({...addField, provinsi: "", kabupaten: "", kecamatan: ""})
            }
            else if(val){
                const resKab = await getKabupaten(val.id)
                setAddField({...addField, provinsi : val.nama, kabupaten : "", kecamatan: ""})
                setDataDaerah({...dataDaerah, "kabupaten" : resKab})
            }
        }
        else if(key === "kabupaten"){
            if(reason === "clear"){
                setAddField({...addField, kabupaten: "", kecamatan: ""})
            }
            else if(val){
                const resKec = await getKecamatan(val.id)
                setAddField({...addField, kabupaten: val.nama, kecamatan: ""})
                setDataDaerah({...dataDaerah, "kecamatan" : resKec})
            }
        }
        else if(key === "kecamatan"){
            if(reason === "clear"){
                setAddField({...addField, kecamatan: ""})
            }
            else if(val) setAddField({...addField, kecamatan: val.nama})
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
                    style={{ maxWidth: 400 }} margin="dense" label="Nama" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, "nama" : e.target.value})}
                />
                <Autocomplete
                    id="provinsi"
                    options={dataDaerah["provinsi"]}
                    getOptionLabel={(option) => option.nama}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnDataDaerahChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Provinsi" variant="outlined" />}
                />
                <Autocomplete
                    id="kabupaten"
                    options={dataDaerah["kabupaten"]}
                    getOptionLabel={(option) => option.nama}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnDataDaerahChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kabupaten" variant="outlined" />}
                />
                <Autocomplete
                    id="kecamatan"
                    options={dataDaerah["kecamatan"]}
                    getOptionLabel={(option) => option.nama}
                    style={{ maxWidth: 400 }}
                    onChange={handleOnDataDaerahChange}
                    renderInput={(params) => <TextField {...params} margin="dense" fullWidth label="Kecamatan" variant="outlined" />}
                />
                <TextField 
                    style={{ maxWidth: 400 }} margin="dense" label="Jalan" type="text" 
                    fullWidth  variant="outlined"
                    onChange={(e) => setAddField({...addField, "jalan" : e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                Add
                </Button>
            </DialogActions>
            </Dialog>
      </div>
    )
}



const TokoPage = ({dataToko}) => {
    const history = useHistory()
    const location = useLocation()
    const currLocation = location.pathname
    let query = useQuery()

    /* Handle Search Query */
    let filteredToko = [...dataToko]
    let currSearchQuery = (query.get("q") || "").trim()
    let currStateSetting = { nama: true, jalan: false, kecamatan: false, provinsi: false }
    const settingSearchAttribute = ["nama", "jalan", "kecamatan", "provinsi"]

    if(currSearchQuery.length != 0){
        const searchMethods = (query.get("sm") || "").trim().split('|').map(met => met.trim()).filter(q => settingSearchAttribute.includes(q))
        if(searchMethods.length != 0){
            currStateSetting["nama"] = false
            let tmpFilteredToko = []
            for(const searchMethod of searchMethods){
                currStateSetting[searchMethod] = true
                tmpFilteredToko = tmpFilteredToko.concat(filteredToko.filter(toko => toko[searchMethod].toLowerCase().includes(currSearchQuery)))
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

    /* Handle Page Query */
    const MAX_TOKO_PER_PAGE = 5
    const cntPage = Math.ceil(filteredToko.length/MAX_TOKO_PER_PAGE)
    const currPage = parseInt(query.get("page")) || 1
    const startIdx = (currPage-1)*MAX_TOKO_PER_PAGE
    const endIdx = startIdx+MAX_TOKO_PER_PAGE-1
   
    filteredToko = filteredToko.filter((toko, idx) => (idx >= startIdx && idx <= endIdx))
    const [tokosLoaded, setTokosLoaded] = useState(true)
    const handlePageChange = (event, val) => {
        setTokosLoaded(false)
        setTimeout(() => {
            history.push(currLocation+'?page='+val)
            setTokosLoaded(true)
        }, 1000)
    }
    
    
    const stylesPar = {
        "display": "flex",
        "justifyContent": "flex-start",
        "flexWrap" : "wrap"
    }


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
        else console.log('setting method must be provided')
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        handleSearch()
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
            <AddDialog />
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
                                <Grow in={tokosLoaded} key={idx} timeout={500 + 100*idx}>
                                    <Paper elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                        <Toko key={idx} dataToko={toko}/>
                                    </Paper>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            } 

            <div style={{"margin" : "0 auto"}}>
                <Pagination count={cntPage} page={currPage} variant="outlined" color="primary" onChange={handlePageChange} />
            </div>
        </>
    )
}

export default TokoPage