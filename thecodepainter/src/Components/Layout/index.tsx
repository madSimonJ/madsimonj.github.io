import React from 'react';
import { Outlet, Link } from 'react-router-dom';


const Layout = () => {
    return (
        <>
            <h1>Layout</h1>
            <Outlet />
            <Link to="aboutme" >About Me </Link>
            <Link to="readme" >Read Me </Link>
        </>
    );
};

export default Layout;