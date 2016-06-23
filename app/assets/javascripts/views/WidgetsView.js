import React from 'react';
import Header from '../components/header';
import WidgetsList from '../components/widgets-list';

class WidgetsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return !this.props.loading
      ? <div className="wrapper">
        <Header />
        <div className="l-content">
          <WidgetsList data={this.props.data} />
        </div>
      </div>
      : <div className="wrapper">
        <Header />
        <div className="l-content">Loading</div>
      </div>;
  }
}

WidgetsView.propTypes = {
  data: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default WidgetsView;
