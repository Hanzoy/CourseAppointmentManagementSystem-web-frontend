import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from '../Home';
import Login from '../Login';
import NoMatch from '../NoMatch';
import './index.css';

class MRoute extends Component {

    state = {
        reLoad:false
    }

    // async componentDidMount() {
        // const storage = window.localStorage;
        // const result = await axios.post("/user/checkToken", JSON.stringify({token: storage.getItem("token")}));
        // if(result.data.code !== "00000"){
        //     storage.removeItem("token");
        //     this.setState({
        //         reLoad:true
        //     })
        // }
        // console.log("route");
        // await checkToken();
    // }

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