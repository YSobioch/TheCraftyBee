import { Link } from "react-router-dom"

import '../stylesheets/navbarTwo.css'

export function NavbarTwo() {
    return (
      <nav>
        <ul className="navigation">
          <li><Link to='/' className='link'>Shop All</Link></li>
          <li><Link to='/' className='link'>Seasonal</Link></li>
          <li><Link to='/' className='link'>New Creations</Link></li>
        </ul>
      </nav>
    )
} 