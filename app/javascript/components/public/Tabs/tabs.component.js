import React from 'react';
import PropTypes from 'prop-types';

const Tabs = props => (
  <div className="c-tabs -secondary" role="tablist">
    { props.tabs.map(tab => (
      <button
        type="button"
        key={tab.name}
        className="tab"
        role="tab"
        aria-selected={props.selected === tab.name}
        onClick={() => props.onChange(tab)}
      >
        {tab.name}
      </button>
    )) }
  </div>
);

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  })).isRequired,
  onChange: PropTypes.func.isRequired // eslint-disable-line
};

export default Tabs;
