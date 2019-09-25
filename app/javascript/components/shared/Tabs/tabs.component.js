import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ tabs, selected, modifier, onChange }) => (
  <div className={`c-tabs -${modifier}`} role="tablist">
    { tabs.map(tab => (
      <button
        type="button"
        key={tab.name}
        className="tab"
        role="tab"
        aria-selected={selected === tab.name}
        onClick={() => onChange(tab)}
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
  onChange: PropTypes.func.isRequired,
  modifier: PropTypes.string,
};

Tabs.defaultProps = {
  modifier: 'secondary'
};

export default Tabs;
