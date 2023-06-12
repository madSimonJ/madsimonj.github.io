import react from 'react';
import {Outlet} from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <p>layout begin</p>
            <Outlet />
            <p>layout end</p>
        </>
    );
};

export default Layout;