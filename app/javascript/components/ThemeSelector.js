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
    name: 'green',
    mainColor: '#16723d',
    category: [
      '#16723d',
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
    name: 'purple',
    mainColor: '#623cbc',
    category: [
      '#623cbc',
      '#96BD3C',
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
    name: 'blue',
    mainColor: '#3c53bc',
    category: [
      '#3c53bc',
      '#BDA53C',
      '#EF4848',
      '#3BB2D0',
      '#C32D7B',
      '#F577B9',
      '#FAB72E',
      '#5FD2B8',
      '#F1800F',
      '#9F1C00',
      '#A5E9E3',
      '#B9D765',
      '#393F44',
      '#CACCD0',
      '#717171'
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
