import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

import './brand.css';
import { LinkContainer } from 'react-router-bootstrap';
import logo from './logo.png';

const Brand = () => {
    return (
        <>
            <LinkContainer to="/">
                <Navbar.Brand>
                    <img src={logo} alt="logo" width="500" height="100" />            
                </Navbar.Brand>
            </LinkContainer>
        </>
    );
};

export default Brand;
