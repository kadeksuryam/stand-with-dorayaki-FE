import React from 'react'
import { IconButton, Tooltip, AppBar, Toolbar, Typography, Button, makeStyles} from "@material-ui/core"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { Link } from 'react-router-dom'


const Navbarc = ({darkState, handleThemeChange}) => {
    return(
        <AppBar color="secondary" position="sticky">
            <Toolbar>
                <div style={{flexGrow: 1}}>
                    <Button component={Link} to="/toko-dorayaki">
                        Stand with Dorayaki
                    </Button>
                </div>
                <Button component={Link} to="/dorayaki">Dorayaki</Button>
                <Tooltip title="Toggle dark/light mode">
                    <IconButton aria-label="light/dark mode" onClick={handleThemeChange} component="span">
                        {
                            darkState ?
                            <Brightness7Icon /> :
                            <Brightness4Icon />
                        }
                    </IconButton>
                </Tooltip>    
            </Toolbar>
        </AppBar>
    )
}

export default Navbarc