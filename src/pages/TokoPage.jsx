import React from 'react'
import Toko from '../components/Toko'

const TokoPage = () => {
    const dummyToko = [
        {
            "nama" : "Toko Serbaguna",
            "jalan" : "Jalan sudirman",
            "kecamatan" : "Buleleng",
            "provinsi" : "Bali",
            "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
        }
    ]
    return (
        <div>
            {
                dummyToko.map((toko, idx) => (
                    <Toko toko={toko} key={idx}/>
                ))
            }
        </div>
    )
}

export default TokoPage