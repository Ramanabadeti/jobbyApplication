import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const defaultViewValues = {
  initialView: 'INITIAL',
  loaderView: 'LOADING',
  errorView: 'ERROR',
  successView: 'SUCCESS',
}

class Profile extends Component {
  state = {renderView: defaultViewValues.initialView, profileDetails: {}}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({renderView: defaultViewValues.loaderView})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const profileResponse = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: profileResponse,
        renderView: defaultViewValues.successView,
      })
    } else {
      this.setState({renderView: defaultViewValues.errorView})
    }
  }

  renderSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <div>
        <img src={profileDetails.profileImageUrl} alt="profile" />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoaderView = () => (
    <div>
      <div className="loader-container" data-testid="loader">
        <Loader
          className="loader"
          type="ThreeDots"
          color="#ffffff"
          height="50"
          width="50"
        />
      </div>
    </div>
  )

  renderErrorView = () => {
    const onBtnRetry = () => {
      this.getProfileDetails()
    }

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <button onClick={onBtnRetry}>Retry</button>
      </div>
    )
  }

  renderAllViews = () => {
    const {renderView} = this.state

    switch (renderView) {
      case defaultViewValues.successView:
        return this.renderSuccessView()
      case defaultViewValues.loaderView:
        return this.renderLoaderView()
      case defaultViewValues.errorView:
        return this.renderErrorView()
      default:
        return null
    }
  }

  render() {
    const {profileDetails} = this.state

    return <div>{this.renderAllViews()}</div>
  }
}

export default Profile
