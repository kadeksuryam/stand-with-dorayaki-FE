import React, {useEffect, useState} from 'react'
import Toko from '../components/Toko'
import { Pagination } from '@material-ui/lab'
import { Grow, Paper, IconButton, InputBase, Divider, Typography, Collapse, Box, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import CloseIcon from '@material-ui/icons/Close';
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

const TokoPage = () => {
    const history = useHistory()
    const location = useLocation()
    let query = useQuery()
    let currPage = parseInt(query.get("page")) || 1
    const MAX_TOKO_PER_PAGE = 5
    const [tokos, setTokos] = useState([
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        },
        {
            "nama" : "Toko Serbagunad",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        }
    ])

    const stylesPar = {
        "display": "flex",
        "justifyContent": "flex-start",
        "flexWrap" : "wrap"
    }
    const startIdx = (currPage-1)*MAX_TOKO_PER_PAGE
    const endIdx = startIdx+MAX_TOKO_PER_PAGE-1

    const cntPage = Math.ceil(tokos.length/MAX_TOKO_PER_PAGE)
    const currPageToko = tokos.filter((toko, idx) => (idx >= startIdx && idx <= endIdx))

    const [tes, setTes] = useState(true)
    const handlePageChange = (event, val) => {
        const currLocation = location.pathname
        setTes(false)
        setTimeout(() => {
            history.push(currLocation+'?page='+val)
            setTes(true)
       }, 1000)
    }

    const searchBarClasses = searchBarStyles()
    const [settingButton, setSettingButton] = useState(true)
    const handleSetting = () => setSettingButton(!settingButton)

    const [stateSetting, setStateSetting] = React.useState({
        nama: true,
        jalan: false,
        kecamatan: false,
        provinsi: false
    })
    
    const handleChangeSetting = (event) => {
        setStateSetting({ ...stateSetting, [event.target.name]: event.target.checked });
    }

    const settingSearchAttribute = ["nama", "jalan", "kecamatan", "provinsi"]

    return (
        <>
            <Paper component="form" className={searchBarClasses.root}>
                <InputBase
                    className={searchBarClasses.input}
                    placeholder="Cari Toko Dorayaki"
                    inputProps={{ 'aria-label': 'cari toko dorayaki' }}
                />
                <IconButton type="submit" className={searchBarClasses.iconButton} aria-label="search">
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
                    </Paper>
            </Collapse>
            {
                <div style={stylesPar}>
                    {
                        currPageToko.map((toko, idx) => (
                            <div key={idx}>
                                <Grow in={tes} key={idx} timeout={500 + 100*idx}>
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