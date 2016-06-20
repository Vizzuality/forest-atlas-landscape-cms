import React from 'react';
import { NAV_PUSH, NAV_POP } from '../actions/navigation';

import Header from './Header';

class HomeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    // console.log(this.props);

    setTimeout(function() {
      this.props.dispatch({
        type: NAV_PUSH,
        page: 'page'
      });
    }.bind(this), 3000);
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }

}

export default HomeView;
