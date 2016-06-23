import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="l-header">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/widgets">Widgets</Link></li>
          <li><Link to="/map">Map</Link></li>
        </ul>
      </div>
    );
  }

}

export default Header;
