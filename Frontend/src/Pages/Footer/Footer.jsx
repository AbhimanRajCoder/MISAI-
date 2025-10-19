import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '/Images/logo.png'

import './Footer.css'

function Footer() {
  return (
<div className="footercontainer">

<div className="footerdiv">
<div className="footerbrand">
<NavLink to="/"> <img src={logo} className="logoimg" alt="logo" /></NavLink>
</div>

<div className="navdiv">
  
<div className="footernavgroup">
<NavLink className="footer-item" to="/">Home</NavLink>
<NavLink className="footer-item" to="/testai">Test Your AI</NavLink>
<NavLink className="footer-item" to="/testimage">Image Checker </NavLink>
<NavLink className="footer-item" to="/testvideo">Video Checker </NavLink>
<NavLink className="footer-item" to="/misbot">MisBot</NavLink>
</div>

</div>

</div>

<div className="cptext-div">
<h4 className='copyright-text'>Copyright © 2025 ATLAX</h4>
</div>


</div>
  )
}

export default Footer

