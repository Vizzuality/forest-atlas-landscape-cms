import React from 'react';
import WidgetsView from '../views/WidgetsView';
import { connect } from 'react-redux';
import { init } from '../actions/widgets-list';

class Widgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: props.loading
    };
  }

  componentWillMount() {
    if (!this.props.widgets.length) {
      this.props.init();
    }
  }

  render() {
    return (
      <WidgetsView
        data={this.props.widgets}
        loading={this.props.loading}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.widgetsList.loading,
    widgets: state.widgetsList.widgets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    init: () => {
      dispatch(init());
    }
  };
}

Widgets.propTypes = {
  widgets: React.PropTypes.array,
  loading: React.PropTypes.bool,
  init: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Widgets);
