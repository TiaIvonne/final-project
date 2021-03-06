import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import AllRequests from './AllRequests.js'
import MyPetitions from './MyPetitions'
import DirectMessages from './messages/DirectMessages'
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
            myOffers: false,
            listOfMyOffers: [],
            messages: [],
            activeMenuItems: [true, false, false, false, false]
        }
        this.openSection = this.openSection.bind(this)
    }
    openSection(selectedSection) {
        this.setState({activeSection: selectedSection})
        //This switch case is for selecting the active item in the menu
        switch(selectedSection) {
            case 'all requests':
                this.setState({activeMenuItems: [true, false, false, false, false]})
                break;
            case 'my petitions':
                this.setState({activeMenuItems: [false, true, false, false, false]})
                break;
            case 'messages':
                this.setState({activeMenuItems: [false, false, true, false, false]})
                break;
            case 'profile':
                this.setState({activeMenuItems: [false, false, false, true, false]})
                break;
            case 'settings':
                this.setState({activeMenuItems: [false, false, false, false, true]})
                break;
            default:
                this.setState({activeMenuItems: [true, false, false, false, false]})
        }
    }
    notificationControl = (dataFromRequest, statusControl) => {
        let checkOffers = []
        switch(statusControl) {
            case 'offers':
                for(var i = 0; i < dataFromRequest.length; i++) {
                    if(dataFromRequest[i].status === 'Pending') checkOffers.push('new offer')
                }
                if(checkOffers.length > 0) return this.setState({myOffers: true})
                else return this.setState({myOffers: false})
            case 'petitions':
                for(var j = 0; j < dataFromRequest.length; j++) {
                    if(dataFromRequest[j].status === 'Approved') checkOffers.push('new offer')
                }
                if(checkOffers.length > 0) return this.setState({petitionsNotification: true})
                else return this.setState({petitionsNotification: false})
            default:
            return null
        }
    }
    getMyOffers = () => {
        axios({
            method: "get",
            url: `${config.api}/my-offers`,
            // url: `${config.REACT_APP_api}/my-offers`,
            withCredentials: true
          })
          .then(responseFromApi => {
            this.setState({
              listOfMyOffers: responseFromApi.data,
            })
            this.notificationControl(responseFromApi.data, 'offers')
          })
    }
    getMyPetitions = () =>{
        axios({
          method: "get",
          url: `${config.api}/my-petitions`,
        //   url: `${config.REACT_APP_api}/my-petitions`,
          withCredentials: true
        })
        .then(responseFromApi => {
          this.setState({
            listOfPetitions: responseFromApi.data,
          })
          this.notificationControl(responseFromApi.data, 'petitions')
        })
    }
    cleanNotif = (sectionNotif) => {
        if(sectionNotif === 'offers') this.setState({myOffers: false})
        else if(sectionNotif === 'petitions') this.setState({petitionsNotification: false})
    }
    componentDidMount(){
        this.getMyPetitions()
        this.getMyOffers()
    }
    render() { 

        return (
            <div className='content-sticky'>
                <div className='section'>
                    <div className='container'>
                        <div className='columns'>
                            <aside className="menu column is-3">
                                <ul className="menu-list">
                                    {this.state.myOffers ?
                                        <Link className={this.state.activeMenuItems[0] ? "is-active" : "has-notification"} onClick={()=> {this.openSection('all requests')}}>
                                            My offers &nbsp;<i className="fas fa-bell"></i>
                                        </Link>
                                        :
                                        <Link className={this.state.activeMenuItems[0] ? "is-active" : "inactive"} onClick={()=> {this.openSection('all requests')}}>
                                            My offers &nbsp;<i className="fas fa-bell-slash"></i>
                                        </Link>
                                    }
                                </ul>
                                <ul className="menu-list">
                                    {this.state.petitionsNotification ?
                                        <Link className={this.state.activeMenuItems[1] ? "is-active" : "has-notification"} onClick={()=> {this.openSection('my petitions')}}>
                                            My petitions &nbsp;<i className="fas fa-bell"></i>
                                        </Link>
                                        :
                                        <Link className={this.state.activeMenuItems[1] ? "is-active" : "inactive"} onClick={()=> {this.openSection('my petitions')}}>
                                            My petitions &nbsp;<i className="fas fa-bell-slash"></i>
                                        </Link>
                                    }
                                </ul>
                                <ul className="menu-list">
                                    <Link className={this.state.activeMenuItems[2] ? "is-active" : "inactive"} onClick={()=> {this.openSection('messages')}}>
                                        Chat
                                    </Link></ul>
                                <ul className="menu-list">
                                    <Link className={this.state.activeMenuItems[3] ? "is-active" : "inactive"} onClick={()=> {this.openSection('profile')}}>
                                        Profile
                                    </Link></ul>
                                <ul className="menu-list">
                                    <Link className={this.state.activeMenuItems[4] ? "is-active" : "inactive"} onClick={()=> {this.openSection('settings')}}>
                                        Settings
                                    </Link></ul>
                            </aside>
                            <div className="column">
                            {(() => {
                                //this switch case is used to open the selected section when you click the menu item
                                switch(this.state.activeSection) {
                                    case 'all requests':
                                        return <AllRequests {...this.props} {...this.state} cleanNotif={this.cleanNotif} updateOffers={this.getMyOffers} listOfMyOffers={this.state.listOfMyOffers}/>;
                                    case 'my petitions':
                                        return <MyPetitions {...this.props} {...this.state} cleanNotif={this.cleanNotif} listOfPetitions={this.state.listOfPetitions} />;
                                    case 'messages':
                                        return <DirectMessages/>
                                    case 'profile':
                                        return <MyProfile />
                                    case 'settings':
                                        return <UserSettings {...this.props} openSection={this.openSection}/>
                                    default:
                                        return <AllRequests {...this.props} {...this.state} listOfMyOffers={this.state.listOfMyOffers}/>
                                }
                            })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserDashboard;