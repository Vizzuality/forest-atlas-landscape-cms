import React from 'react';
import PropTypes from 'prop-types';

const THEMES = [
  {
    name: 'default',
    mainColor: '#97bd3d',
    category: [
      '#97bd3d',
      '#2C75B0',
      '#FAB72E',
      '#EF4848',
      '#3BB2D0',
      '#C32D7B',
      '#F577B9',
      '#5FD2B8',
      '#F1800F',
      '#9F1C00',
      '#A5E9E3',
      '#B9D765',
      '#393F44',
      '#CACCD0',
      '#717171'
    ]
  },
  {
    name: 'pine',
    mainColor: '#907A59',
    category: [
      '#907A59',
      '#6AAC9F',
      '#D5C0A1',
      '#5C7D86',
      '#F9AF38',
      '#F05B3F',
      '#89AD24',
      '#CE4861',
      '#F5808F',
      '#86C48F',
      '#F28627',
      '#B23912',
      '#BAD6AF',
      '#C9C857',
      '#665436'
    ]
  },
  {
    name: 'wind',
    mainColor: '#5A7598',
    category: [
      '#5A7598',
      '#C1CCDC',
      '#DBB86F',
      '#B7597B',
      '#5FAB55',
      '#8D439E',
      '#CD87CA',
      '#6BC8CB',
      '#C58857',
      '#712932',
      '#ACE3E9',
      '#B1D193',
      '#294260',
      '#49ACDB',
      '#2A75C3'
    ]
  }
];

class ThemeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: null
    };
  }

  componentDidMount() {
    if (this.props.defaultTheme) {
      const theme = this.props.themes.find(t => t.name === this.props.defaultTheme);
      if (theme) {
        this.onClickTheme(theme);
      }
    }
  }

  /**
   * Event handler executed when the user clicks a theme
   * @param {object} theme Theme
   */
  onClickTheme(theme) {
    this.setState({ theme });
    this.props.onChange(theme);
  }

  render() {
    return (
      <div className="c-themes-list">
        {this.props.themes.map(theme => (
          <div className="card" key={theme.name}>
            <label htmlFor={`theme-selector-${theme.name.replace(' ', '-')}`}>
              {theme.name}
            </label>
            <input
              type="radio"
              name="theme"
              id={`theme-selector-${theme.name.replace(' ', '-')}`}
              onClick={() => this.onClickTheme(theme)}
              checked={this.state.theme === theme}
            />
            <div className="content">
              <h3>{theme.name}</h3>
              <div className="theme">
                <div style={{ flexBasis: '100%', background: theme.mainColor }} />
                <div style={{ flexBasis: '100%', display: 'flex' }}>
                  {theme.category.map(color => (
                    <div key={color} style={{ flexBasis: `${100 / theme.category.length}%`, background: color }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ThemeSelector.defaultProps = {
  themes: THEMES,
  defaultTheme: null
};

ThemeSelector.propTypes = {
  /**
   * Name of the default theme
   */
  defaultTheme: PropTypes.string,
  /**
   * List of themes to display
   * Check https://vega.github.io/vega/docs/schemes/
   * for options for the built-in color schemes
   */
  themes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    mainColor: PropTypes.string.isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired
  })),
  /**
   * Callback executed when the user selects a theme
   * Receive the theme object
   */
  onChange: PropTypes.func.isRequired
};

export default ThemeSelector;
