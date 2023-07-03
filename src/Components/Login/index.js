import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', errorMgs: '', showErrorMgs: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    this.setState({showErrorMgs: false})
    history.replace('/')
  }

  onSubmitFailure = mgs => {
    console.log(mgs)
    this.setState({errorMgs: mgs, showErrorMgs: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const details = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(details),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showErrorMgs, errorMgs} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <form onSubmit={this.onSubmitForm}>
          <label htmlFor="username">Username</label>
          <input onChange={this.onChangeUsername} type="text" id="username" />
          <label htmlFor="password">Password</label>
          <input
            onChange={this.onChangePassword}
            type="password"
            id="password"
          />
          <button type="submit">login</button>
        </form>
        {showErrorMgs && <p>{errorMgs}</p>}
      </div>
    )
  }
}

export default Login
