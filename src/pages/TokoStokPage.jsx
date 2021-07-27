import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import TokoStok from '../components/TokoStok'
import { API_BASE_URL } from '../utils/config'
import axios from 'axios'

const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap"
}

const TokoStokPage = ({notif, setNotif}) => {
    const [tokoStoks, setTokoStoks] = useState([])
    const { id } = useParams()

    useEffect(() => {
        const getStok = async () => {
            try{
                const stokURL = API_BASE_URL + `/stok-dorayakis/?idToko=${id}`
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
    
    const syncDataStokToko = async () => {
        try{
            const stokURL = API_BASE_URL + `/stok-dorayakis/?idToko=${id}`
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
        <div style={{minHeight: "100vh"}}>
            <div style={stylesPar}>
                {
                    tokoStoks.map((tokoStok, idx) => (
                        <div key={idx}>
                            <Grow in={true} key={idx}>
                                <Paper  elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                    <TokoStok key={idx} dataTokoStok={tokoStok}
                                        notif={notif} setNotif={setNotif}
                                        syncDataStokToko={syncDataStokToko}/>
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