import React, { Component } from 'react';
import { BrowserRouter,Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Login from '../Login';
import NoMatch from '../NoMatch';
import './index.css';

class MRoute extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/home" component={Home}/>
                    <Route component={NoMatch}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default MRoute;