import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment'
import config from '../../config.json'
import MyReview from './MyReview'


//render my profile with my time wallet and basic personal settings
class MyProfile extends Component {
    state = { 
        profileInfo: {},
        reviewer:{},
        myReviews: [],
        currentPage: 1,
        reviewsPerPage: 5
     }
    
    getProfileInfo = () =>{
        axios({
          method: "get",
          url: `${config.api}/my-profile`,
        //   url: `${config.REACT_APP_api}/my-profile`,
          withCredentials: true
        })
        .then(responseFromApi => {
          this.setState({
            profileInfo: responseFromApi.data
          })
        })
        .catch(err => {
            console.log(err)
        })
    }

    getMyReviews = () => {
        axios({
            method: "get",
            url: `${config.api}/my-reviews`,
            withCredentials: true
          })
          .then(responseFromApi => {
            this.setState({
              myReviews: responseFromApi.data
            })
          })
          .catch(err => {
              console.log(err)
          })
    }

    handlePageClick = (event) => {
        this.setState({currentPage: Number(event.target.id)})
    }

    componentDidMount() {
        this.getProfileInfo();
        this.getMyReviews();
    }
    render() { 
        const { myReviews, currentPage, reviewsPerPage } = this.state
        const indexOfLastReview = currentPage * reviewsPerPage
        const indexOfFirstReview = indexOfLastReview - reviewsPerPage
        const currentReviews = myReviews.slice(indexOfFirstReview, indexOfLastReview)
        const renderReviews = currentReviews.map (review => {
            return <MyReview
                rating={review.rating}
                opinion={review.opinion}
                date={review.date}
                pictureUrl={review.picture}
                reviewer={review.reviewer}
            />
        })

        const pageNumbers = []
        for (let i = 1; i <= Math.ceil(myReviews.length / reviewsPerPage); i++) {
            pageNumbers.push(i)
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handlePageClick}
                    className="page-numbers column"
                >
                    {number}
                </li>
            )
        })
        return (
            <div className="card">
                <div className="columns">
                    <div className="card-image column is-one-quarter profile-img">
                        <figure className="image is-128x128">
                        {/* <img src={`${config.REACT_APP_api}/${this.state.profileInfo.profileImage}`} alt="Profile"/> */}
                        <img src={`${config.api}/${this.state.profileInfo.profileImage}`} alt="Profile"/>
                        </figure>
                    </div>
                    <div className="content column">
                        <p className="title has-text-left">{this.state.profileInfo.firstname} {this.state.profileInfo.lastname}</p>
                        <p className="title is-5 has-text-left">Time wallet: {this.state.profileInfo.timeWallet} hour(s)</p>
                        <p className="has-text-left"><strong>Registration Date:</strong> &nbsp;<Moment format="D MMM YYYY" withTitle>{this.state.profileInfo.registrationDate}</Moment></p>
                    </div>
                </div>
                <div className="card-content">
                    <div className="media">
                    <div className="media-content">
                        <p><strong>Username:</strong> &nbsp; {this.state.profileInfo.username}</p>
                        <p><strong>e-mail:</strong> &nbsp; {this.state.profileInfo.email}</p>
                        <p><strong>Bio:</strong> &nbsp; {this.state.profileInfo.bio}</p>
                    </div>
                    </div>
                    {this.state.myReviews.length > 0 ?
                        <>
                            <h1 className="title">Reviews I have received</h1>
                            <div className="column">
                                { renderReviews }
                                <div className="columns page-numbers-column">
                                    <ul className="level column is-half is-offset-one-quarter columns">
                                        { renderPageNumbers }
                                    </ul>
                                </div>
                            </div>
                        </> :
                        <></>
                    }
                </div>
            </div>
        );
    }
}
 
export default MyProfile;