import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function ToggleSwitcher(props) {
  return (
    <div className="c-toggle-switcher">
      <ul>
        {props.elements.map(el => (
          <li key={el}>
            <button
              className={classnames({ '-active': el === props.selected })}
              tabIndex="0"
              onClick={() => props.onChange(el)}
            >
              {el}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ToggleSwitcher.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ToggleSwitcher;
