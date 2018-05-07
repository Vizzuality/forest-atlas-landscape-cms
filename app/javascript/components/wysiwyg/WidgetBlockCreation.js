import React from 'react';
import PropTypes from 'prop-types';

export default function WidgetBlockCreation({ block, onSubmit }) {
  const { widgets } = block.admin;
  return (
    <div className="fa-add-widget">
      <h3>Select a widget</h3>
      <ul>
        {widgets.map((w) => {
          return (
            <li key={w.widget.name}>
              <h4>{w.widget.name}</h4>
              <button onClick={() => onSubmit({
                widgetId: w.widget.id,
                datasetId: w.widget.dataset,
                categories: []
              })}
              >Add widget
              </button>
            </li>);
        })}
      </ul>
    </div>
  );
}

WidgetBlockCreation.propTypes = {

};
