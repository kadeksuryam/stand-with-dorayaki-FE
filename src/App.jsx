import React, { useState } from 'react'
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

  const dataToko = [
    {
        "nama" : "Toko Serbaguna",
        "jalan" : "Jalan Sudirman",
        "kecamatan" : "Buleleng",
        "kabupaten" : "Kabupaten Buleleng",
        "provinsi" : "Bali",
        "gambar" : "https://www.pngall.com/wp-content/uploads/8/Retail-Business-PNG-Free-Download.png"
    }
]

  return (
      <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
          <Navbarc darkState={darkState} handleThemeChange={handleThemeChange}/>
          <Paper style={{height: "auto"}}>
            <Switch>
              <Route path="/toko-dorayaki">
                <TokoPage dataToko={dataToko}/>
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
