import React from "react"
import PropTypes from "prop-types"

import { connect } from 'react-redux';

import { ExtendedHeader } from 'components';

const EditWidget = ({  }) => (
  <div>
    <ExtendedHeader title="Widget title" subTitle="Im a subtitle" />
    <p>hello edit widget from react</p>
  </div>
 );

function mapStateToProps(state) {
  return {
    // Map state here
  }
}

export default connect(mapStateToProps, null)(EditWidget);
