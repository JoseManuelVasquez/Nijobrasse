import React, { Component } from 'react';
import styled from 'styled-components'
import '../styles/App.css';

const Button = styled.button`
  background: #1EB980;
  border-radius: 8px;
  color: white;
  height: ${props => props.small ? 40 : 60}px;
  width: ${props => props.small ? 60 : 120}px;
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            Welcome to Nijobrasse
            <Button large>Sign Up</Button>
        </header>
      </div>
    );
  }
}

export default App;
