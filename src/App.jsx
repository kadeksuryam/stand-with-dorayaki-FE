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

function App() {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
  const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];
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

  return (
      <BrowserRouter>
        <Navbarc darkState={darkState} handleThemeChange={handleThemeChange}/>
        <ThemeProvider theme={darkTheme}>
          <Paper style={{height: "auto"}}>
            <Switch>
              <Route path="/toko-dorayaki">
                <TokoPage />
              </Route>
            </Switch>
          </Paper>
        </ThemeProvider>
      </BrowserRouter>  
  )
}

export default App
