import { connect } from 'react-redux';
import { navigatePush, navigatePop } from '../actions/navigation';
import Home from '../views/HomeView';


function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: (action) => {
      if (action.type === 'back') {
        dispatch(navigatePop(action));
      } else {
        dispatch(navigatePush(action));
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
