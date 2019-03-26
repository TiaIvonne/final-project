import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import AllRequests from './AllRequests.js'
import MyPetitions from './MyPetitions'
import DirectMessages from './DirectMessages'
import UserSettings from './UserSettings'
import MyProfile from './MyProfile'
import axios from 'axios';
import config from '../../config.json'


class UserDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSection: 'all requests',
            petitionsNotification: false,
            listOfPetitions: [],
            offersRequestedNotification: false,
            listOfOffersRequested: []
        }
        this.openSection = this.openSection.bind(this)
    }
    openSection(selectedSection) {
        this.setState({activeSection: selectedSection})
    }
    // Para las ofertas que te han pedido, deberiamos preguntar por ofertas 
    // en las que authorUsername = tu username, que el status sea pending
    getMyOffersRequested = () => {
        axios({
            method: "get",
            url: `${config.api}/my-offers-requested`,
            withCredentials: true
          })
          .then(responseFromApi => {
            this.setState({
              listOfOffersRequested: responseFromApi.data,
            })
            if(responseFromApi.data.length > 0) this.setState({offersRequestedNotification: true})
          })
    }
    getMyPetitions = () =>{
        axios({
          method: "get",
          url: `${config.api}/my-petitions`,
          withCredentials: true
        })
        .then(responseFromApi => {
          this.setState({
            listOfPetitions: responseFromApi.data,
          })
          if(responseFromApi.data.length > 0) this.setState({petitionsNotification: true})
        })
    }
    componentDidMount(){
        this.getMyPetitions()
        this.getMyOffersRequested()
    }
    render() { 
        return (
            <>
                <aside className="menu">
                    <p className="menu-label">
                        All requests
                    </p>
                    <ul className="menu-list">
                        <li><Link onClick={()=> {this.openSection('all requests')}}>Pending requests &nbsp;  
                        { this.state.offersRequestedNotification ? <i className="fas fa-bolt"></i> : <i className="fas fa-times"></i> }
                        </Link></li>
                        <li><Link onClick={()=> {this.openSection('all requests')}}>History</Link></li>
                    </ul>
                    <p className="menu-label">
                        My petitions
                    </p>
                    <ul className="menu-list">
                        <li><Link onClick={()=> {this.openSection('my petitions')}}>Pending petitions &nbsp;  
                        { this.state.petitionsNotification ? <i className="fas fa-bolt"></i> : <i className="fas fa-times"></i> }
                        </Link></li>
                        <li><Link onClick={()=> {this.openSection('my petitions')}}>History</Link></li>
                    </ul>
                    <p className="menu-label"><Link onClick={()=> {this.openSection('messages')}}>
                        Direct messages
                    </Link></p>
                    <p className="menu-label"><Link onClick={()=> {this.openSection('profile')}}>
                        Profile
                    </Link></p>
                    <p className="menu-label"><Link onClick={()=> {this.openSection('settings')}}>
                        Settings
                    </Link></p>
                </aside>
                <div>
                {(() => {
                    switch(this.state.activeSection) {
                        case 'all requests':
                            return <AllRequests listOfOffersRequested={this.state.listOfOffersRequested}/>;
                        case 'my petitions':
                            return <MyPetitions listOfPetitions={this.state.listOfPetitions} />;
                        case 'messages':
                            return <DirectMessages/>
                        case 'profile':
                            return <MyProfile />
                        case 'settings':
                            return <UserSettings />
                        default:
                            return <AllRequests />
                    }
                })()}
                </div>

                
                
            </>
        );
    }
}

export default UserDashboard;