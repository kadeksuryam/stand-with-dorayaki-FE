import React, { useEffect, useState } from 'react'
import './App.css'
import Navbarc from './components/Navbar'
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Paper, Button } from "@material-ui/core"
import {
  orange,
  lightBlue,
  deepPurple,
  deepOrange
} from "@material-ui/core/colors";
import TokoPage from './pages/TokoPage'
import TokoStokPage from './pages/TokoStokPage'
import { API_BASE_URL } from './utils/config'
import axios from 'axios'
import Notification from './components/Notification'
import DorayakiPage from './pages/DorayakiPage';

function App() {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
  const mainSecondaryColor = darkState ? deepPurple[500] : deepOrange[900]
  const darkTheme = createTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      }
    }
  });
  const handleThemeChange = () => {
    if(darkState)
      localStorage.setItem("currTheme", "light")
    else localStorage.setItem("currTheme", "dark")
    setDarkState(!darkState);
  };

  const [dataTokos, setDataTokos] = useState([])
  const [dataDorayakis, setDataDorayakis] = useState([])

  useEffect(() => {
    const getDataToko = async () => {
      try{
        const resDataTokos = (await axios.get(API_BASE_URL + '/toko-dorayakis')).data
        const resDataDorayakis = (await axios.get(API_BASE_URL + '/dorayakis')).data
        
        setDataTokos(resDataTokos)
        setDataDorayakis(resDataDorayakis)
      } catch(err){
        let errMsg = err.message.toString()
        if(err.response)
            if(err.response.data.error)
                 errMsg = err.response.data.error
        setNotif({...notif, open: true, type: "error", msg: errMsg})
      }
    }
    getDataToko()
    if(localStorage.getItem("currTheme") === "dark") setDarkState(true)
    else setDarkState(false)
  }, [])

  const syncDataTokos = async () => {
    try{
      const resDataTokos = (await axios.get(API_BASE_URL + '/toko-dorayakis')).data
      setDataTokos(resDataTokos)
    } catch(err){
      let errMsg = err.message.toString()
      if(err.response)
          if(err.response.data.error)
               errMsg = err.response.data.error
      setNotif({...notif, open: true, type: "error", msg: errMsg})
    }
  }
  
  const syncDataDorayakis = async () => {
    try{
      const resDataDorayakis = (await axios.get(API_BASE_URL + '/dorayakis')).data
      setDataDorayakis(resDataDorayakis)
      
    } catch(err){
      let errMsg = err.message.toString()
      if(err.response)
          if(err.response.data.error)
               errMsg = err.response.data.error
      setNotif({...notif, open: true, type: "error", msg: errMsg})
    }
  }

  const [notif, setNotif] = useState({open: false, type: "", msg: ""})

  return (
      <BrowserRouter>
        <Notification notif={notif} setNotif={setNotif} />
        <ThemeProvider theme={darkTheme}>
          <Navbarc darkState={darkState} handleThemeChange={handleThemeChange}/>
          <Paper style={{height: "auto"}}>
            <Switch>
              <Route path="/dorayaki">
                <DorayakiPage dataDorayakis={dataDorayakis} syncDataDorayakis={syncDataDorayakis} 
                  notif={notif} setNotif={setNotif}
                  />
              </Route>
              <Route path="/toko-dorayaki/stok/:id">
                <TokoStokPage notif={notif} setNotif={setNotif}/>
              </Route>
              <Route path="/toko-dorayaki">
                <TokoPage dataTokos={dataTokos} syncDataTokos={syncDataTokos} 
                  notif={notif} setNotif={setNotif}
                  />
              </Route>
              <Route path="/">
                <Redirect to="/toko-dorayaki"/>
              </Route>
            </Switch>
          </Paper>
        </ThemeProvider>
      </BrowserRouter>  
  )
}

export default App
