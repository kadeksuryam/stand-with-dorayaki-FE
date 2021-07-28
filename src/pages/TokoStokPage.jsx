import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import TokoStok from '../components/TokoStok'
import { API_BASE_URL } from '../utils/config'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap"
}

const TokoStokPage = ({dataTokos, notif, setNotif}) => {
    const [tokoStoks, setTokoStoks] = useState([])
    const { id } = useParams()
    const currToko = dataTokos.filter(dataToko => dataToko._id === id)[0] || dataTokos[0]

    useEffect(() => {
        const getStok = async () => {
            try{
                const stokURL = API_BASE_URL + `/stok-dorayakis/?tokoDorayakiId=${id}`
                const newTokoStoks = (await axios.get(stokURL)).data

                setTokoStoks(newTokoStoks)
            } catch(err){
                let errMsg = err.message.toString()
                if(err.response)
                    if(err.response.data.error)
                         errMsg = err.response.data.error
                setNotif({...notif, open: true, type: "error", msg: errMsg})
            }
        }
        getStok()
    }, [])
    
    const syncDataTokoStok = async () => {
        try{
            const stokURL = API_BASE_URL + `/stok-dorayakis/?tokoDorayakiId=${id}`
            const newTokoStoks = (await axios.get(stokURL)).data
            
            setTokoStoks(newTokoStoks)
        } catch(err){
            let errMsg = err.message.toString()
            if(err.response)
                if(err.response.data.error)
                     errMsg = err.response.data.error
            setNotif({...notif, open: true, type: "error", msg: errMsg})
        }
    }

    return (
        dataTokos.length !== 0 &&
        <div style={{minHeight: "100vh"}}>
            <Typography variant="h4" style={{marginLeft: "1rem"}}>
                <strong>Stok Dorayaki Toko {currToko.nama}</strong>
            </Typography>
            <div style={stylesPar}>
                {
                    tokoStoks.map((tokoStok, idx) => (
                        <div key={idx}>
                            <Grow in={true} key={idx}>
                                <Paper  elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                    <TokoStok key={idx} dataTokoStok={tokoStok}
                                        dataTokos={dataTokos}
                                        notif={notif} setNotif={setNotif}
                                        syncDataTokoStok={syncDataTokoStok}
                                    />
                                </Paper>
                            </Grow>
                        </div>
                    ))
                }
            </div>
        </div>      
    )
}

export default TokoStokPage