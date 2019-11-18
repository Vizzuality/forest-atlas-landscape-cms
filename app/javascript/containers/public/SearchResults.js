import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import PublicContainer from 'containers/shared/PublicContainer';
import { Footer } from 'components';
import SearchResults from 'components/public/SearchResults';

class SearchResultsContainer extends PublicContainer {
  render() {
    const isIndiaTemplate = this.props.template === 'INDIA';

    return (
      <div className={classnames({ 'fa-page': isIndiaTemplate })}>
        <SearchResults {...this.props} />
        <Footer {...this.store.getState()} />
      </div>
    );
  }
}

SearchResults.propTypes = {
  template: PropTypes.string
};

export default SearchResultsContainer;
