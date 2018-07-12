import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Progress from './router/week/Progress';

class App extends Component {
  render() {
    const pathName = window.location.pathname;
    return (
      <div className="App">
        {pathName === "/" ? <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> : ''
        }
        <BrowserRouter>
          <div>
            <Route path="/progress" component={Progress} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
