import React from 'react';
import Header from '../components/header';

class HomeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="l-content">Home</div>
      </div>
    );
  }

}

HomeView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default HomeView;
