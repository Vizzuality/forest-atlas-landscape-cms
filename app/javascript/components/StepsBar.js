import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function StepsBar(props) {
  return (
    <div className="c-steps-bar">
      <div className="wrapper">
        <ul className="steps">
          {props.steps.map((step, i) => (
            <li key={step}>
              <button
                className={classnames({
                  '-active': i === props.currentStep,
                  '-disabled': i > props.currentStep
                })}
                tabIndex={i >= props.currentStep ? '0' : '-1'}
                onClick={() => ((i < props.currentStep) ? props.onChangeStep(i) : null)}
              >
                {step}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

StepsBar.propTypes = {
  /**
   * Index of the current step
   */
  currentStep: PropTypes.number,
  /**
   * List of the steps names
   */
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Callback executed when the user clicks on another
   * step
   */
  onChangeStep: PropTypes.func.isRequired // eslint-disable-line react/no-unused-prop-types
};

StepsBar.defaultProps = {
  currentStep: 0
};

export default StepsBar;
