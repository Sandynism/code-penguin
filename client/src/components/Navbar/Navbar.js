import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import MessageBar from "../MessageBar"
import API from '../../utils/API';
import './Navbar.css';

export default class Navbar extends Component {
  state = {
    auth: false,
    slide: 0,
    lastScrollY: 0,
    color: 'transparent',
    userPebbles: '',
    creator: '',
    avatar: '/images/penguin.png',
    showDiv: false,
    username: "",
    loggedIn: true
  };

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount = () => {
    this.getHash()
    this.canDist()
  };

  canDist = () => {
    API.canDistribute()
      .then(res => {
        this.setState({showDiv: res.data})
      })
      .catch(err => console.log(err));
  };

  handleAccept = () => {
    API.distribute()
    .then(() => {
      this.getHash()
      this.setState({ showDiv: false})
      if (this.props.updatemaxpeb) {
        this.props.updatemaxpeb()
      }
    })
    .catch(err => console.log(err));
  }

  handleCancel = () => {
    this.setState({ showDiv: false})
  }

  getHash = () => {
    API.getUser()
      .then(res => {
        this.setState({ userPebbles: res.data.pebbles, creator: res.data.hash, username: res.data.userdata.username });
      })
      .catch(err => {
        this.setState({ loggedIn: false })
        console.log(err)
      });
  };

  handleScroll = () => {
    const { lastScrollY } = this.state;
    const currentScrollY = window.scrollY;

    // navbar color effect
    if (window.scrollY > 10) {
      this.setState({ color: 'rgba(32, 32, 32, 0.9)' });
    } else {
      this.setState({ color: 'transparent' });
    }

    // navbar slide effect
    if (currentScrollY > lastScrollY && window.scrollY > 200) {
      this.setState({ slide: '-80px' });
    } else {
      if (window.scrollY < 800) {
        this.setState({ slide: '0px' });
      }
    }
    this.setState({ lastScrollY: currentScrollY });
  };

  render() {
    if (!this.state.loggedIn) return <Redirect to="/login" />;
    return (
      <React.Fragment>
        <div
          id="navigation"
          className="navbar navbar-fixed-top"
          style={{ transform: `translate(0, ${this.state.slide})`, transition: 'all 150ms linear' }}
        >
          <div
            className="navbar-inner"
            style={{ backgroundColor: `${this.state.color}`, transition: 'all 300ms ease-in-out' }}
          >
            <div className="container">
              <nav>
                <ul className="nav">
                  <li key="1">
                    <a href="/marketplace">
                      <h4 className="ui white"> Code Penguin</h4>
                    </a>
                  </li>
                  <li key="5" className="float-right">
                    <a href="/logoff">
                      <p className='ui white'>Logoff</p>
                    </a>
                  </li>
                  <li key="4" className="float-right">
                    <a href="/landing">
                      <p className={this.props.page === 'Landing' ? 'ui white navbold' : 'ui white'}>About</p>
                    </a>
                  </li>
                  <li key="3" className="float-right">
                    <a href="/marketplace">
                      <p className={this.props.page === 'Marketplace' ? 'ui white navbold' : 'ui white'}>
                        Marketplace
                      </p>
                    </a>
                  </li>
                  <li key="2" className="float-right">
                    <a href="/profile">
                      <p className={this.props.page === 'Profile' ? 'ui white navbold' : 'ui white'}>
                        <span style={{letterSpacing: "2px"}}> {`${this.props.changeUser !== undefined ? this.props.changeUser : this.state.username} `} {`${this.props.coinupdate !== undefined && this.state.userPebbles ? this.props.coinupdate : this.state.userPebbles} `} </span>
                      </p>
                      <img
                        className="nav-pebble-img"
                        src="http://pluspng.com/img-png/circle-objects-png-object-256.png"
                        alt="pebbles"
                      />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <MessageBar isWarning={false} showDiv={this.state.showDiv} handleCancel={this.handleCancel} handleAccept={this.handleAccept}/>
      </React.Fragment>
    );
  }
}
