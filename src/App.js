import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Progress from './router/week/Progress';
import Stock from './router/week/Stock';
import Monitor from './router/week/Monitor';

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
        <BrowserRouter>
          <div>
            <Route path="/stock" component={Stock} />
          </div>
        </BrowserRouter>
        <BrowserRouter>
          <div>
            <Route path="/monitor" component={Monitor} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
