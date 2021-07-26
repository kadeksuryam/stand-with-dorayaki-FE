import React, { useEffect, useState } from 'react'
import './App.css'
import Navbarc from './components/Navbar'
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
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
    setDarkState(!darkState);
  };

  const [dataTokos, setDataTokos] = useState([])

  useEffect(() => {
    const getDataToko = async () => {
      try{
        const resDataTokos = (await axios.get(API_BASE_URL + '/toko-dorayakis')).data
        setDataTokos(resDataTokos)
      } catch(err){
        console.log(err.message)
      }
    }
    getDataToko()
  }, [])

  const syncDataTokos = async () => {
    try{
      const resDataTokos = (await axios.get(API_BASE_URL + '/toko-dorayakis')).data
      setDataTokos(resDataTokos)
    } catch(err){
      console.log(err.message)
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
              <Route path="/toko-dorayaki">
                <TokoPage dataTokos={dataTokos} syncDataTokos={syncDataTokos} 
                  notif={notif} setNotif={setNotif}/>
              </Route>
              <Route path="/toko-dorayaki-stok">
                <TokoStokPage/>
              </Route>
            </Switch>
          </Paper>
        </ThemeProvider>
      </BrowserRouter>  
  )
}

export default App
