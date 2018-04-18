import React from "react"
import PropTypes from "prop-types"

import { connect } from 'react-redux';

import { Table } from '../../shared';

const SiteListPages = ({  }) => (
  <div>
    <Table />
  </div>
 );

function mapStateToProps(state) {
  return {
    // Map state here
  }
}

export default connect(mapStateToProps, null)(SiteListPages);
