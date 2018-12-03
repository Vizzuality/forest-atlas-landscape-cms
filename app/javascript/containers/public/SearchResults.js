import React from "react";
import PropTypes from "prop-types";

import PublicContainer from "containers/shared/PublicContainer";
import { CoverPage, Footer } from "components";
import SearchResults from "components/public/SearchResults";

class SearchResultsContainer extends PublicContainer {
  render() {
    return (
      <div>
        <CoverPage {...this.store.getState()} secondary usePageTitle />
        <SearchResults {...this.props} />
        <Footer {...this.store.getState()} />
      </div>
    );
  }
}

export default SearchResultsContainer;
