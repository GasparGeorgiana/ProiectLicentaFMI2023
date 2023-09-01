import React from 'react';
import {Navbar, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';

import {useAuth} from "../Authentication/Auth";
import {Cookies} from "react-cookie";

function NavMenu() {
    const {isAuthenticated,setIsAuthenticated,role} = useAuth();
    const cookies = new Cookies();
    function NavMenu() {
        if(isAuthenticated){
            if(role===1){
                return (
                    <>
                    <NavItem>
                        <NavLink tag={Link} className="nav-link text-dark" to="/restaurants-list">Restaurants List</NavLink>
                    </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="nav-link text-dark" to="/pending-orders">Pending Orders</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="nav-link text-dark" to="/confirmed-orders">Confirmed Orders</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="nav-link text-dark" to="/past-orders">Past Orders</NavLink>
                </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="nav-link text-dark" onClick={logout}>Logout</NavLink>
                        </NavItem>
                    </>  
                );
            }
            else {
                return (
                    <>
                        <NavItem>
                            <NavLink tag={Link} className="nav-link text-dark" to="/add-food">Add Food</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="nav-link text-dark" to="/edit-food">Edit Food</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="nav-link text-dark" to="/your-orders">Your Orders</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="nav-link text-dark" onClick={logout}>Logout</NavLink>
                        </NavItem>
                    </>
                );
            }
        }
        else{
            return (
                <>
                    <NavItem>
                        <NavLink tag={Link} className="nav-link text-dark" to="/home">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="nav-link text-dark" to="/login">Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="nav-link text-dark"
                                 to="/register">Register</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="nav-link text-dark"
                                 to="/register-as-owner">Register As Owner</NavLink>
                    </NavItem>
                </>
            )
        }
    }
    const logout = () => {
       cookies.remove("RestaurantCookie");
        setIsAuthenticated(false);
    }
    return (
        <header>
            <Navbar
                className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3 container-fluid"
                light>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/">
                                <img src="https://cdn-icons-png.flaticon.com/512/1600/1600655.png"
                                     style={{width: '100px', height: '80px', margin: '-50px -10px -50px -10px'}}
                                />
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav flex-row">
                        {NavMenu()}
                    </ul>
                </div>
            </Navbar>
        </header>
    );
}

export default NavMenu;