import {Component} from 'react'
import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {RiHandbagFill} from 'react-icons/ri'
import {BiLinkExternal} from 'react-icons/bi'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Header from '../Header'

import '../JobItem/index.css'

const defaultViewValues = {
  initialView: 'INITIAL',
  loaderView: 'LOADING',
  errorView: 'ERROR',
  successView: 'SUCCESS',
}

class JobProfile extends Component {
  state = {
    jobDetails: {},
    skill: [],
    lifeAtCompany: {},
    similarJobs: [],
    renderView: defaultViewValues.initialView,
  }

  componentDidMount() {
    this.getJobProfileDetails()
  }

  getJobProfileDetails = async () => {
    this.setState({renderView: defaultViewValues.loaderView})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        id: data.job_details.id,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const formattedSkills = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const formattedLifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const formattedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        id: eachJob.id,
        location: eachJob.location,
        title: eachJob.title,
        rating: eachJob.rating,
      }))

      this.setState({
        jobDetails: formattedJobDetails,
        skill: formattedSkills,
        lifeAtCompany: formattedLifeAtCompany,
        similarJobs: formattedSimilarJobs,
        renderView: defaultViewValues.successView,
      })
    } else {
      this.setState({renderView: defaultViewValues.errorView})
    }
  }

  renderSuccessView = () => {
    const {jobDetails, skill, lifeAtCompany, similarJobs} = this.state
    return (
      <div className="job_profile_main_container">
        <Header />
        <div className="jobCard">
          <div className="first_flex">
            <img
              className="company_logo"
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div className="headingDetails">
              <h1>software</h1>
              <FaStar />
              <p>{jobDetails.rating}</p>
            </div>
          </div>

          <div className="second_flex">
            <div>
              <HiLocationMarker />
              <p className="location_space">{jobDetails.location}</p>
              <RiHandbagFill />
              <p>{jobDetails.employmentType}</p>
            </div>
            <p>{jobDetails.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="discrp_and_Link">
            <h1>Description</h1>
            <a href={jobDetails.companyWebsiteUrl}>
              Visit <BiLinkExternal />
            </a>
          </div>
          <p>{jobDetails.jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skillContainer">
            {skill.map(each => (
              <li className="each_skill">
                <img
                  className="skill_photo"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life At Company</h1>
          <div className="life_at_company_container">
            <p>{lifeAtCompany.description}</p>
            <img
              className="life_at_company_photo"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similarJobCard">
          {similarJobs.map(eachJob => (
            <li className="jobCard similarCard">
              <div className="first_flex">
                <img
                  className="company_logo"
                  src={eachJob.companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="headingDetails">
                  <h1>{eachJob.title}</h1>
                  <FaStar />
                  <p>{eachJob.rating}</p>
                </div>
              </div>
              <h1>Description</h1>
              <p>{eachJob.jobDescription}</p>
              <div>
                <HiLocationMarker />
                <p className="location_space">{eachJob.location}</p>
                <RiHandbagFill />
                <p>{eachJob.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        className="loader_clr"
        type="ThreeDots"
        color="#ffffff"
        height="50"
        width="50"
      />
    </div>
  )

  renderErrorView = () => {
    const onBtnRetry = () => {
      this.getJobItems()
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button onClick={onBtnRetry}>Retry</button>
      </div>
    )
  }

  getFetchedDetails = () => {
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
    const {renderView} = this.state
    return <div>{this.getFetchedDetails()}</div>
  }
}

export default JobProfile
