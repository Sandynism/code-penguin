import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import Container from '../../components/Container';
import HoverBox from '../../components/HoverBox/HoverBox';
import Table from '../../components/Table';
// import ProfileInfo from '../../components/HoverBox/ProfileInfo';
import API from '../../utils/API';
import './Profile.css';

export default class Profile extends Component {
  state = {
    creator: '',
    avatar: 'https://via.placeholder.com/150',
    pebbles: '',
    withdrawals: [],
    deposits: [],
    hasGithub: false
  };

  componentDidMount = () => {
    this.getHash();
    this.getTransactions();
    // this.sortWithdrawals()
  };

  getHash = () => {
    API.getUser()
      .then(res => {
        let { github } = res.data.userdata[0].Entry;
        this.setState({
          creator: github || res.data.hash,
          pebbles: res.data.pebbles
        });
        if (github) {
          this.setState({
            hasGithub: true
          });
          API.getGithub(github)
            .then(res => {
              console.log(res);
              this.setState({
                avatar: res.data.avatar_url,
              });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  getTransactions = () => {
    API.getTransactionHistory().then(res => {
      console.log(res);
      this.setState({
        withdrawals: res.data.withdrawals,
        deposits: res.data.deposits
      });
      // console.log(res.data.withdrawals)
      // console.log(res.data.deposits)
    });
  };

  // sortWithdrawals = () => {
  //   let data = this.state.withdrawals;
  //   data.sort((a, b) => {
  //     return new Date(b.Entry.time).getTime() - new Date(a.Entry.time).getTime();
  //   });
  //   this.setState({ withdrawals: data });
  //   console.log(data);
  // };

  render() {
    const focus = 'left';
    let { withdrawals, deposits } = this.state;
    let data = withdrawals.concat(deposits)
    return (
      <React.Fragment>
        <Navbar page="Profile" />
        <HoverBox side={focus}>
          {/* <ProfileInfo prof={this.props.profSeed}/> */}
          <div className="input-div" style={{ margin: '10px 0' }}>
            {this.state.hasGithub ? <div>
                <div className="label">
                  <label>Hello, </label>
                </div>
                <span className="span-user">{this.state.creator.toUpperCase()}</span>
              </div> :
              <div>
                <div className="label">
                  <label>Add your github username?</label>
                </div>
              </div>}
            {/* <span className="span-user">QmWtWoTu6qeSkiSBW7F7sKnrEYowfunci5BLHzpZDuxTjy</span> */}
            <img
              className="avatar"
              width="150px"
              src={this.state.avatar}
              alt={this.state.creator}
            />
            <span className="span-pebbles">Today's Pebble Count {this.state.pebbles}</span>
          </div>
        </HoverBox>
        <Container padding={focus} bgcolor="rgb(32,32,32)">
          <div className="div-404">
            <h2>Pebble Transaction History</h2>
            <Table data={data} />

          

          </div>
        </Container>
      </React.Fragment>
    );
  }
}

// res.data.deposits/withdrawals.Entry.time/pebbles/origin
// {
//   "deposits": [
//     {
//       "Entry": {
//         "destination": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX",
//         "origin": "QmTHhcNysEfNUyAczp9j9ACJW1jMho4yYnEzUinAMSqFg6",
//         "pebbles": 1000,
//         "time": 1542075242085
//       },
//       "EntryType": "transaction",
//       "Hash": "QmbAa5qeHUFRJ49PcnwGWj8px7EbhFyUrAaNaw31cq4dHd",
//       "Source": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX"
//     }
//   ],
//   "withdrawals": [
//     {
//       "Entry": {
//         "destination": "QmdgL2Vcuyg9aoCp5E1f8pTq9W11YWkBp2pRT4resVwjsU",
//         "origin": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX",
//         "pebbles": 25,
//         "time": 1542075242136
//       },
//       "EntryType": "transaction",
//       "Hash": "QmWZJsc9FhvmKJEjnXo3ro1LQ7oQHEew4MapuCwfXgPc2n",
//       "Source": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX"
//     },
//     {
//       "Entry": {
//         "destination": "QmbmgjGku2sQRtKF849ZtWWfhFHhacjracUMPU9AWVauyi",
//         "origin": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX",
//         "pebbles": 200,
//         "time": 1542075242244
//       },
//       "EntryType": "transaction",
//       "Hash": "QmRbPRJYK2aQq949BHohRxLy2fXuzQPViUEEDnHX3iwNqy",
//       "Source": "QmXNJrCDFCpqFVRcWQ3Tr6uZ7N6GZ5ssQfKcMUzqQTiJaX"
//     }
//   ]
// }
