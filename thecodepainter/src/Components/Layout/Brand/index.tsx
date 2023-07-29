import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

import './brand.css';
import { LinkContainer } from 'react-router-bootstrap';

const Brand = () => {
    return (
        <>
            <LinkContainer to="/">
                <Navbar.Brand>
                    <span className='h1'>
                        SJP
                    </span>                
                </Navbar.Brand>
            </LinkContainer>
        </>
    );
};

export default Brand;
