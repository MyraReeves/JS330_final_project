import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Header() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Check for an existing token (an already previously logged-in user) on initial page load: //
  /////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  //////////////////////////////////////////////////////////////////////////////
  // Delete a user's auth token from browser memory when that user logs out: //
  ////////////////////////////////////////////////////////////////////////////
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/login')  // TO-DO:  THE LOGIN PAGE HASN'T YET BEEN WRITTEN! THIS PATH WILL NEED TO BE ALTERED TO POINT TO INSIDE THE "PAGES" DIRECTORY!
  }


  return (
    <header>
      <div className='dropdown-menu'>
        <button className='dropdown-button'>🗺️  ▾</button>
        <ul className='dropdown-content'>
          <li><Link to='/'>Homepage </Link></li>
          <li><Link to='/oregon'>Oregon parks </Link></li>
          <li><Link to='/washington'>Washington parks </Link></li>
        </ul>
      </div>

      <h1>
        🏞 Visit Your National Parks! 🏞
      </h1>

    {/* The following block checks whether a user is logged in or not, and then displays the appropriate in/out link depending on the results: */}
      <div className='account-doorway-link'>
        {isLoggedIn ? ( <button onClick={handleLogout}>Logout</button> ) : ( <Link to="/login">Login</Link>) }
      </div>
    </header>
  )
}

export default Header
