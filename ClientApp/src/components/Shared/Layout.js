import React from 'react';
import {Container} from 'reactstrap';
import NavMenu from './NavMenu';
import Footer from './Footer';

function Layout(props) {

    return (
        <div>
            <NavMenu/>
            <Container>
                {props.children}
            </Container>
            <Footer/>
        </div>
    );
}

export default Layout;