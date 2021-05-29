import React, {Component} from 'react';
import Exception from 'ant-design-pro/lib/Exception';
import './index.css';

class Index extends Component {
    render() {
        return (
            <div>
                <Exception type="404" />
            </div>
        );
    }
}

export default Index;