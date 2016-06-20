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
      <div>
        <Header />
        <div>Home</div>
      </div>
    );
  }

}

HomeView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default HomeView;
