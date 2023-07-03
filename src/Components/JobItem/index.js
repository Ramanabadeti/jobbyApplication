import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {RiHandbagFill} from 'react-icons/ri'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobApplicationDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobApplicationDetails

  return (
    <Link to={`jobs/${id}`}>
      <li className="jobCard">
        <div>
          <div className="first_flex">
            <img
              className="company_logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="headingDetails">
              <h1>{title}</h1>
              <FaStar />
              <p>{rating}</p>
            </div>
          </div>

          <div className="second_flex">
            <div>
              <HiLocationMarker />
              <p className="location_space">{location}</p>
              <RiHandbagFill />
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
