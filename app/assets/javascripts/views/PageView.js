import React from 'react';
import Header from '../components/header';

class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Header />
        <div>Page</div>
      </div>
    );
  }

}

PageView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default PageView;
