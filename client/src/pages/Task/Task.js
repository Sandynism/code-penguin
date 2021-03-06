import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import MessageBar from '../../components/MessageBar';
import Container from '../../components/Container';
import TaskBox from '../../components/TaskBox';
import SolutionCommentBox from '../../components/SolutionCommentBox';
import { Button, Grid } from 'semantic-ui-react';
import './Task.css';
import API from '../../utils/API';

export default class Task extends Component {
  state = {
    task: {
      comments: [],
      solutions: [],
      tags: [],
      title: '',
      details: '',
      pebbles: '',
      creator: '',
      time: ''
    },
    creatorUser: '',
    user: '',
    maxPebbles: '',
    pebbles: '',
    toggler: 'solutions',
    newComment: '',
    newSolutionLink: '',
    newSolutionDes: '',
    rewardHash: '',
    rewarded: {
      link: '',
      text: '',
      task: '',
      time: ''
    },
    showDiv: false,
    message: ""
  };

  componentDidMount = () => {
    this.getInfo()
    this.getSolutionRewardInfo();
    this.getUserHash();
  };

  getInfo = () => {
    API.getTask(this.props.match.params.hash)
      .then(res => {
        let rawdata = res.data;
        let date = new Date(res.data.time);
        rawdata.time = `${date.toDateString()}, ${date.toLocaleTimeString()}`;
        rawdata.solutions.sort((a,b)=>b.Entry.time-a.Entry.time);
        rawdata.comments.sort((a,b)=>b.Entry.time-a.Entry.time);
        this.setState({ task: rawdata });
        return rawdata.creator
      })
      .then((hash) => {
        this.getCreatorUser(hash)
        
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCreatorUser = (creatorHash) => {
    API.getUser(creatorHash)
      .then(res=>{
        this.setState({creatorUser: res.data.userdata.username})
      })
      .catch(err => console.log(err));
  }

  getSolutionRewardInfo = () => {
    API.rewardedSolution(this.props.match.params.hash)
      .then(res => {
        if (res.data[0]) {
          this.setState({ rewardHash: res.data[0].Hash, rewarded: res.data[0].Entry });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getUserHash = () => {
    API.getUser()
      .then(res => {
        this.setState({
          user: res.data.hash,
          maxPebbles: res.data.pebbles
        });
      })
      .catch(err => console.log(err));
  };

  handleToggle = event => {
    this.setState({ toggler: event.target.name }, () => {
      if (this.state.toggler === 'comments') {
        this.setState({ newSolutionLink: '', newSolutionDes: '' });
      } else if (this.state.toggler === 'solutions') {
        this.setState({ newComment: '' });
      }
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const task = this.props.match.params.hash;
    if (this.state.toggler === 'solutions') {
        if (
            this.state.newSolutionLink.includes('github') &&
            this.state.newSolutionLink.includes('.com')
        ) {
            const text = this.state.newSolutionDes;
            const link = this.state.newSolutionLink;
            this.addSolution({ task, text, link });
        } else {
            this.setState({ showDiv: true, message: "Please add a GitHub link"})
        }
    } else if (this.state.toggler === 'comments') {
      const ctext = this.state.newComment;
      this.addComment({ page: task, text: ctext });
    }
  };

  handleCancel = () => {
    this.setState({ showDiv: false})
  }

  handleBackTask = () => {
    const { hash } = this.props.match.params;
    let { pebbles, maxPebbles } = this.state;
    pebbles = parseInt(pebbles)
    if (pebbles <= maxPebbles) {
      console.log("hello");
      API.backTask({
        task: hash,
        pebbles: pebbles
      })
        .then(res => {
          // console.log(res);
          this.setState({ pebbles: '' });
          this.getUserHash();
          this.getInfo();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleClear = () => {
    this.setState({ newComment: '', newSolutionLink: '', newSolutionDes: '' });
  };

  handleReward = hash => {
    API.reward(hash)
      .then(res => {
        // console.log(res);
        this.getSolutionRewardInfo();
      })
      .catch(err => console.log(err));
  };

  addSolution = solution => {
    var { task, user} = this.state;
    if (this.state.newSolutionDes === "") {
      this.setState({ showDiv: true, message: "Please enter a description for the solution"})
    } else {
      if (task.creator === user) {
        this.setState({ showDiv: true, message: "You cannot post a solution to your own task"})
      } else {
        API.createSolution(solution)
        .then(res => {
          this.handleClear();
          this.getInfo();
        })
        .catch(err => console.log(err));
      }
    }
    
  };

  addComment = comment => {
    if (this.state.newComment === "") {
      this.setState({ showDiv: true, message: "You can not submit a blank comment"})
    } else {
      API.createComment(comment)
        .then(res => {
          this.handleClear();
          this.getInfo();
        })
        .catch(err => console.log(err));
    }
    
  };

  render() {
    var { task, user, rewardHash, toggler, creatorUser, maxPebbles } = this.state;
    return (
      <React.Fragment>
        <Navbar coinupdate={maxPebbles}/>
        <MessageBar isWarning={true} showDiv={this.state.showDiv} handleCancel={this.handleCancel}>
            {this.state.message}
        </MessageBar>
        <Container bgcolor="rgb(32,32,32)">
          <TaskBox>
            <div className="pebble-div">
              <span>
                {' '}
                {task.pebbles === '' || task.pebbles === undefined ? '0' : `${task.pebbles}`}{' '}
              </span>
              <img
                className="task-pebble-img"
                src="http://pluspng.com/img-png/circle-objects-png-object-256.png"
                alt="pebbles"
              />
            </div>
            <div className="sol-com-btn-div">
              <Button.Group size="mini" compact>
                <Button
                  name="solutions"
                  onClick={this.handleToggle}
                  color={toggler === 'solutions' ? 'teal' : 'grey'}
                >
                  {' '}
                  Solutions{' '}
                </Button>
                <Button.Or />
                <Button
                  name="comments"
                  onClick={this.handleToggle}
                  color={toggler === 'comments' ? 'teal' : 'grey'}
                >
                  {' '}
                  Comments{' '}
                </Button>
              </Button.Group>
            </div>
            <Grid divided="vertically">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <div className="task-problem">
                    <h2>{task.title}</h2>
                    <div className="creator-info-div">
                      <p>Creator: <a href={`/user/${task.creator}`}>{creatorUser !== "" ? creatorUser : task.creator}</a></p>
                      <p>Created: {task.time}</p>
                    </div>
                    <div className="div-blue-box" style={{ height: '60px' }}>
                      <p style={{ wordSpacing: '7px' }}>
                        {task.tags.map(tag => '#' + tag).join(' ')}
                      </p>
                    </div>
                    <h4>Details:</h4>
                    <div className="div-blue-box" style={{ height: '40%' }}>
                      <p>{task.details}</p>
                    </div>
                    <div className="task-add-pebb">
                      <label>Add your pebbles: </label>
                      <input
                        type="number"
                        name="pebbles"
                        placeholder={`( ${this.state.maxPebbles} max )`}
                        onChange={this.handleInputChange}
                        value={this.state.pebbles}
                        required
                      />
                      <button onClick={this.handleBackTask}>Add</button>
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="sol-col-show-div">
                    <ul style={{ display: `${toggler === 'solutions' ? 'block' : 'none'}` }}>
                      {task.solutions.length !== 0 ? (
                        task.solutions.map((solution, i) => (
                          <SolutionCommentBox
                            solution={true}
                            solutionInfo={solution.Entry}
                            solHash={solution.Hash}
                            key={i}
                            isCreator={task.creator === user ? true : false}
                            creatorHash={solution.Entry.creator}
                            reward={this.handleReward}
                            rewardHash={this.state.rewardHash}
                          />
                        ))
                      ) : (
                        <p>There are currently no solutions</p>
                      )}
                    </ul>
                    <ul style={{ display: `${toggler === 'comments' ? 'block' : 'none'}` }}>
                      {task.comments.length !== 0 ? (
                        task.comments.map((comment, i) => (
                          <SolutionCommentBox
                            solution={false}
                            commentText={comment.Entry.text}
                            creatorHash={comment.Entry.creator}
                            key={i}
                          />
                        ))
                      ) : (
                        <p>There are currently no comments</p>
                      )}
                    </ul>
                  </div>
                  <div className="sol-com-input-div">
                    <div
                      style={{
                        display: `${
                          toggler === 'solutions' && rewardHash === '' ? 'block' : 'none'
                        }`
                      }}
                    >
                      {' '}
                      {/* If there is a chosen solution then on toggle solution this is gone*/}
                      <input
                        type="text"
                        placeholder="Enter Solution description"
                        name="newSolutionDes"
                        value={this.state.newSolutionDes}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        placeholder="Enter Link to Github Repo here"
                        name="newSolutionLink"
                        value={this.state.newSolutionLink}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div style={{ display: `${toggler === 'comments' ? 'block' : 'none'}` }}>
                      <textarea
                        type="text"
                        placeholder="Write your comment here"
                        name="newComment"
                        value={this.state.newComment}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div
                      style={{
                        display: `${
                          rewardHash !== '' && toggler === 'solutions' ? 'none' : 'block'
                        }`
                      }}
                    >
                      {/* If there is a chosen solution then on toggle solution this is gone*/}
                      <button className="task-submit" onClick={this.handleSubmit}>
                        Submit
                      </button>
                      <button className="task-clear" onClick={this.handleClear}>
                        Clear
                      </button>
                    </div>
                    <div
                      className="sol-col-chosen"
                      style={{
                        display: `${
                          rewardHash !== '' && toggler === 'solutions' ? 'block' : 'none'
                        }`
                      }}
                    >
                      {/* If there is a chosen solution then on toggle solution this SHOWS*/}
                      <h4>Winning Solution:</h4>
                      <a
                        href={
                          this.state.rewarded.link.includes('http')
                            ? this.state.rewarded.link
                            : `https://${this.state.rewarded.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>{this.state.rewarded.text}</div>
                      </a>
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </TaskBox>
        </Container>
      </React.Fragment>
    );
  }
}
