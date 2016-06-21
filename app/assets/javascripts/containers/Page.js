import React from 'react';
import PageView from '../views/PageView';
import { connect } from 'react-redux';
import { init } from '../actions/widgets-list';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: props.loading
    };
  }

  componentWillMount() {
    this.props.init();
  }

  render() {
    return (
      <PageView
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

Page.propTypes = {
  widgets: React.PropTypes.array,
  loading: React.PropTypes.bool,
  init: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
