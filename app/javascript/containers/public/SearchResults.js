import React from "react";
import PropTypes from "prop-types";

import PublicContainer from "containers/shared/PublicContainer";
import { Footer } from "components";
import SearchResults from "components/public/SearchResults";

class SearchResultsContainer extends PublicContainer {
  render() {
    return (
      <div>
        <SearchResults {...this.props} />
        <Footer {...this.store.getState()} />
      </div>
    );
  }
}

export default SearchResultsContainer;
