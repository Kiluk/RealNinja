import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function NavBar() {
    const pages = ['home','login'];
    const navLinks = pages.map(page => {
      return (
        <Router>
        <a href={'/' + page}>
           &nbsp;{page}
        </a>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        </Router>
      )
    });

    return <nav>{navLinks}</nav>;
}
export default NavBar;