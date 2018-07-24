import React from 'react';
import PropTypes from 'prop-types';
import { Range, createSliderWithTooltip } from 'rc-slider';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

import { applyTimezoneOffset } from 'helpers/date';

const RangeWithTooltip = createSliderWithTooltip(Range);

class DashboardFilters extends React.Component {
  /**
   * Event handler executed when the user selects the field that will be
   * attached to a filter
   * @param {{}} filter Filter to update
   * @param {string} fieldName Name of the chosen field
   */
  onSelectField(filter, fieldName) {
    const field = this.props.fields.find(f => f.name === fieldName);
    this.props.onChangeFilter(filter, Object.assign(
      {},
      filter,
      { name: field.name, type: field.type }
    ));
  }

  /**
   * Get the FlatPicker configuration for a specific filter
   * @param {{ min: number, max: number, values: number[] }} filter Filter
   * @return {object}
   */
  getFlatPickerConfig(filter) {
    const timestampRange = filter.max - filter.min;
    return {
      minDate: filter.values.length
        ? applyTimezoneOffset(filter.values[0])
        : null,
      maxDate: filter.values.length
        ? applyTimezoneOffset(filter.values[1])
        : null,
      dateFormat: timestampRange <= 24 * 3600 * 1000 // eslint-disable-line no-nested-ternary
        ? 'H:i'
        : (timestampRange <= 7 * 24 * 3600 * 1000
          ? 'd-m-Y H:i'
          : 'd-m-Y'
        ),
      time_24hr: true,
      noCalendar: timestampRange <= 24 * 3600 * 1000,
      enableTime: timestampRange <= 7 * 24 * 3600 * 1000,
      locale: { firstDayOfWeek: 1 }
    };
  }

  /**
   * Set the visibility of the tooltip of the filter
   * @param {any} filter Filter whose tooltip's visibility will be set
   * @param {bool} visible Visibility of the tooltip
   */
  setTooltipVisility(filter, visible) {
    this.props.onChangeFilter(filter, Object.assign(
      {},
      filter,
      { tooltipOpen: visible }
    ));
  }

  render() {
    return (
      <div className="c-dashboard-filters">
        <ul>
          {this.props.filters.map((f, i) => (
            <li key={f.name || i}>
              <div className="field">
                <label htmlFor={`field-${i}`}>Column</label>
                <div className="field-name">
                  {!!f.name && (
                    <div className="c-select -small">
                      <select id={`field-${i}`} disabled>
                        <option>{f.alias || f.name}</option>
                      </select>
                    </div>
                  )}
                  { !!f.name && !!f.description && (
                    <div className="tooltip-container">
                      <button
                        type="button"
                        onMouseOver={() => this.setTooltipVisility(f, true)}
                        onMouseOut={() => this.setTooltipVisility(f, false)}
                        onClick={() => this.setTooltipVisility(f, !f.tooltipOpen)}
                      >
                        Info
                      </button>
                      { f.tooltipOpen && <div className="tooltip">{f.description}</div> }
                    </div>
                  )}
                  {!f.name && (
                    <div className="c-select -small">
                      <select id={`field-${i}`} defaultValue="" onChange={({ target }) => this.onSelectField(f, target.value)}>
                        <option disabled value="">Select a column</option>
                        { this.props.fields.map(field => (
                          <option key={field.name} value={field.name}>{field.alias || field.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="content">
                { f.type === 'number' && <label>Range</label>}
                { f.type === 'string' && <label htmlFor={`filter-values-${i}`}>Values</label>}
                { f.type === 'date' && (f.loading || f.error) && <div className="placeholder">&nbsp;</div>}
                { f.loading && (
                  <div className="info">
                    <div className="c-loading-spinner -inline -small" />
                    <span>Loading...</span>
                  </div>
                )}
                { !f.loading && f.error && (
                  <div className="info">
                    <span>An error occured. Please try to remove and add this filter again.</span>
                  </div>
                )}
                { !f.loading && !f.error && f.type === 'number' && f.min !== undefined && f.max !== undefined && (
                  <div className="slider">
                    <span>{f.min}</span>
                    <RangeWithTooltip
                      allowCross={false}
                      min={f.min}
                      max={f.max}
                      value={f.values}
                      onChange={
                        values => this.props.onChangeFilter(f, Object.assign({}, f, { values }))
                      }
                    />
                    <span>{f.max}</span>
                  </div>
                )}
                { !f.loading && !f.error && f.type === 'date' && f.min !== undefined && f.max !== undefined && (
                  <div className="date-pickers">
                    <div>
                      <label htmlFor={`filter-date-from-${i}`}>From</label>
                      <Flatpickr
                        id={`filter-date-from-${i}`}
                        options={Object.assign({}, this.getFlatPickerConfig(f), {
                          defaultDate: applyTimezoneOffset(f.values[0]),
                          minDate: applyTimezoneOffset(f.min)
                        })}
                        onChange={([date]) => this.props.onChangeFilter(
                          f,
                          Object.assign({}, f, { values: [+date, f.values[1]] })
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor={`filter-date-to-${i}`}>To</label>
                      <Flatpickr
                        id={`filter-date-to-${i}`}
                        options={Object.assign({}, this.getFlatPickerConfig(f), {
                          defaultDate: applyTimezoneOffset(f.values[1]),
                          maxDate: applyTimezoneOffset(f.max)
                        })}
                        onChange={([date]) => this.props.onChangeFilter(
                          f,
                          Object.assign({}, f, { values: [f.values[0], +date] })
                        )}
                      />
                    </div>
                  </div>
                )}
                { !f.loading && !f.error && f.type === 'string' && !!f.possibleValues && (
                  <Select
                    id={`filter-values-${i}`}
                    multi
                    options={f.possibleValues.map(v => ({ label: v, value: v }))}
                    value={f.values.map(v => ({ label: v, value: v }))}
                    onChange={values => this.props.onChangeFilter(
                      f,
                      Object.assign({}, f, { values: values.map(v => v.label) })
                    )}
                  />
                )}
              </div>
              <div className="actions">
                <div className="placeholder">&nbsp;</div>
                { f.name && (
                  <button type="button" className="delete-button" onClick={() => this.props.onRemoveFilter(f)}>Remove</button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="toolbar">
          <div />
          <div>
            <button type="button" className="c-button -outline -dark-text" onClick={this.props.onResetFilters}>Reset</button>
            <button type="button" className="c-button -primary" onClick={this.props.onApplyFilters}>Apply filters</button>
          </div>
        </div>
      </div>
    );
  }
}

DashboardFilters.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  filters: PropTypes.array.isRequired,
  onAddFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired
};

export default DashboardFilters;
