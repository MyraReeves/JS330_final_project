import { Link } from 'react-router-dom'

function Header() {

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
            🏞 &nbsp; Visit Your National Parks! &nbsp; 🏞
        </h1>
    </header>
    )
  }
  
  export default Header