import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Home from '../views/HomeView';


function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps() {
  return {
    dispatch: (action) => {
      if (action.type === 'back') {
        browserHistory.goBack();
      } else {
        browserHistory.push(action.page);
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
