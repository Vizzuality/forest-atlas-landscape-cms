import React from 'react';
import { NAV_PUSH } from '../../actions/navigation';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick(page) {
    this.props.dispatch({
      type: NAV_PUSH,
      page: page
    });
  }

  render() {
    return (
      <div className="l-header">
        <a onClick={() => this.onClick('/')}>Home</a>
        <a onClick={() => this.onClick('/page')}>Page</a>
      </div>
    );
  }

}

Header.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default Header;
