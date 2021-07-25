import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import TokoStok from '../components/TokoStok'
    
const stylesPar = {
    "display": "flex",
    "justifyContent": "flex-start",
    "flexWrap" : "wrap"
}

const TokoStokPage = () => {
    const [tokoStoks, setTokoStoks] = useState([])
    const { idToko } = useParams()

    useEffect(() => {
        //API CALL, sesuai Id Toko
        const newTokoStoks = [
            {
                rasa : "manis",
                deskripsi : "dorayaki coklat",
                gambar : "https://upload.wikimedia.org/wikipedia/commons/7/7f/Dorayaki_001.jpg",
                stok : 5
            }
        ]
        
        setTokoStoks(newTokoStoks)
    }, [])
    
    return (
        <>
            <div style={stylesPar}>
                {
                    tokoStoks.map((tokoStok, idx) => (
                        <div key={idx}>
                            <Grow in={true} key={idx}>
                                <Paper  elevation={10} key={idx} style={{"margin" : "1rem"}}>
                                    <TokoStok key={idx} dataTokoStok={tokoStok}/>
                                </Paper>
                            </Grow>
                        </div>
                    ))
                }
            </div>
        </>      
    )
}

export default TokoStokPage