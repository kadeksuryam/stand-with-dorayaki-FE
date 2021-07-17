import React from 'react'
import { Navbar, Container, Nav, OverlayTrigger} from 'react-bootstrap'
import { IconButton} from "@material-ui/core"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { Link } from 'react-router-dom'


const Navbarc = ({darkState, handleThemeChange}) => {
    return(
        <Navbar sticky="top" collapseOnSelect expand="sm" bg={darkState ? "dark" : "primary"}>
            <Container fluid>
                <Navbar.Brand style={{ color: 'white' }} as={Link} to='/toko-dorayakis'>Stand with Dorayaki</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} style={{ color: 'white' }} to="/dorayakis">Dorayaki</Nav.Link>
                    </Nav> 
                    <Nav className="ml-auto"></Nav>
                    <IconButton style={{ color: 'white' }} aria-label="light/dark mode" onClick={handleThemeChange} component="span">
                        {
                            darkState ?
                            <Brightness7Icon /> :
                            <Brightness4Icon />
                        }
                    </IconButton>
                </Navbar.Collapse>
            </Container>
        </Navbar> 
    )
}

export default Navbarc