import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LinkContainer} from 'react-router-bootstrap'

import Brand from './Brand'

const Layout = () => {
    return (
        <>
            <Navbar expand="lg" className='bg-body-tertiary'>
                <LinkContainer to="/">
                    <Brand />
                </LinkContainer>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse >
                        <Nav className="me-auto">
                            <LinkContainer to="/about">
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Talks">
                                <Nav.Link>Talks</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Podcasts">
                                <Nav.Link>Podcasts</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Upcoming">
                                <Nav.Link>Upcoming</Nav.Link>
                            </LinkContainer>
                            {/* <LinkContainer to="/Gallery">
                                <Nav.Link>Gallery</Nav.Link>
                            </LinkContainer> */}
                            <LinkContainer to="/Contact">
                                <Nav.Link>Contact</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/blog">
                                <Nav.Link>Blog</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Book">
                                <Nav.Link>Book</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
            
        </>
    );
};

export default Layout;