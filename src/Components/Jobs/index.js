import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Profile from '../Profile'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const defaultViewValues = {
  initialView: 'INITIAL',
  loaderView: 'LOADING',
  errorView: 'ERROR',
  successView: 'SUCCESS',
}

const selectedListOfEmployeeTypes = []

class Jobs extends Component {
  state = {
    renderView: defaultViewValues.initialView,
    jobsList: [],
    salaryRange: '',
    employmentType: '',
    searchInput: '',
    searchInputValue: '',
  }

  componentDidMount() {
    this.getJobItems()
  }

  getJobItems = async () => {
    this.setState({renderView: defaultViewValues.loaderView})
    const {salaryRange, employmentType, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(url, options)
    console.log(response.ok)

    if (response.ok) {
      const data = await response.json()
      const convertedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobsList: convertedData,
        renderView: defaultViewValues.successView,
      })
    } else {
      this.setState({renderView: defaultViewValues.errorView})
    }
  }

  renderSalaryRange = () =>
    salaryRangesList.map(each => {
      const salaryChanged = () => {
        this.setState({salaryRange: each.salaryRangeId}, this.getJobItems)
      }
      return (
        <li>
          <input
            id={each.employmentTypeId}
            value={each.label}
            type="radio"
            onClick={salaryChanged}
            name="salary_Type"
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      )
    })

  renderEmployeeType = () =>
    employmentTypesList.map(each => {
      const onClickEmployeeType = () => {
        if (selectedListOfEmployeeTypes.includes(each.employmentTypeId)) {
          const indexOfEmpId = selectedListOfEmployeeTypes.indexOf(
            each.employmentTypeId,
          )
          selectedListOfEmployeeTypes.splice(indexOfEmpId, 1)
        } else {
          selectedListOfEmployeeTypes.push(each.employmentTypeId)
        }
        this.setState(
          {employmentType: selectedListOfEmployeeTypes.join(',')},
          this.getJobItems,
        )
      }
      return (
        <li>
          <input
            id={each.salaryRangeId}
            onClick={onClickEmployeeType}
            type="checkbox"
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      )
    })

  renderSearchBar = () => {
    const {searchInputValue} = this.state
    const onSearchBtn = event => {
      event.preventDefault()
      this.setState({searchInput: searchInputValue}, this.getJobItems)
    }

    // const onEnterBtn = event => {
    //   if (event.key === 'Enter') {
    //     this.setState({searchInput: searchInputValue})
    //   }
    // }

    const onChangeSearchInput = event => {
      this.setState({searchInputValue: event.target.value})
    }

    return (
      <form className="search_input_field" onSubmit={onSearchBtn}>
        <input
          //   onKeyDown={onEnterBtn}
          onChange={onChangeSearchInput}
          value={searchInputValue}
          type="search"
          placeholder="Search"
        />
        <button data-testid="searchButton" type="submit">
          <BsSearch />
        </button>
      </form>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state

    return (
      <ul>
        {jobsList.length > 0 ? (
          jobsList.map(each => (
            <JobItem key={each.id} jobApplicationDetails={each} />
          ))
        ) : (
          <li>
            <img
              alt="no jobs"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </li>
        )}
      </ul>
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
    const {jobsList, renderView} = this.state
    return (
      <div>
        <Header />
        <div className="jobs_container">
          <div className="profile_filters">
            <Profile />
            <hr />
            <div>
              <h1>Type of Employment</h1>
              <ul>{this.renderEmployeeType()}</ul>
            </div>
            <hr />
            <div>
              <h1>Salary Range</h1>
              <ul>{this.renderSalaryRange()}</ul>
            </div>
          </div>

          <div className="search_items">
            {this.renderSearchBar()}
            {this.getFetchedDetails()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
