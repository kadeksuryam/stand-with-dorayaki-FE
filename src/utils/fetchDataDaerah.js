import axios from 'axios'

const getProvinsi = async () => {
    try{
        const provinsiURI = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
        const res = await axios.get(provinsiURI)

        return res.data.provinsi
    } catch(err){
        return {error : err}
    }
}

const getKabupaten = async (provinsi_id) => {
    try{
        const kabupatenURI = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${provinsi_id}`
        const res = await axios.get(kabupatenURI)

        return res.data.kota_kabupaten
    } catch(err){
        return {error : err}
    }
}

const getKecamatan = async (kabupaten_id) => {
    try{
        const kecamatanURI = `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${kabupaten_id}`
        const res = await axios.get(kecamatanURI)
        return res.data.kecamatan
    } catch(err){
        return {error : err}
    }   
}

export { getProvinsi, getKabupaten, getKecamatan }