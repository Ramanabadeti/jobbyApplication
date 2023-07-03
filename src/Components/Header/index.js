import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const logoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <ul className="navBtns">
        <li>
          <Link className="navBtns" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="navBtns" to="/jobs">
            Jobs
          </Link>
        </li>
        <li>*</li>
      </ul>
      <button className="logoutBtn" type="button" onClick={logoutButton}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
