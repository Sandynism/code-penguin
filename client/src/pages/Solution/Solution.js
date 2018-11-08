import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import Container from '../../components/Container';
import SolveBox from '../../components/SolveBox';
import './Solution.css';

export default class Solution extends Component {
  render() {
    const focus = 'center';

    return (
      <React.Fragment>
        <Navbar page="Solution" />
        <SolveBox side={focus}>
          <SolveBox prof={this.props.solutionSeed} />
        </SolveBox>
        <Container padding={focus} bgcolor="rgb(32,32,32)">
          <div className="div-404">
            <h1>Solution</h1>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}
