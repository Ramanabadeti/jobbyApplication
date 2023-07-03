import {withRouter, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const findJobsButton = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div className="home">
      <Header />
      <div className="content-home">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          millions of people are searching for jobs,salary information, company
          reviews.
        </p>
        <Link to="/jobs">
          <button
            className="findJobsBtn"
            type="button"
            onClick={findJobsButton}
          >
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withRouter(Home)
