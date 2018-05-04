import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';

class Carusel extends React.Component {
  constructor(props) {
    super(props);

    // Make this dynamic when time
    this.margin = 20;
    this.width = 360;
    this.inView = 3;

    this.state = {
      offset: -this.margin
    };
  }

  changeSlide(forw) {
    if (forw) {
      const endWidth = (this.width * this.props.children.length) - (this.width * this.inView) + this.margin;
      if (this.state.offset === endWidth) {
        this.setState({ offset: -this.margin });
      } else {
        this.setState({ offset: (this.state.offset - 360) });
      }
      return;
    }

    if (this.state.offset === this.margin) {
      this.setState({ offset: -this.margin });
    } else {
      this.setState({ offset: (this.state.offset + 360) });
    }
  }

  render() {
    const styles = {
      transform: `translateX(${this.state.offset}px)`
    };

    console.log(styles);

    return (
      <div className="carusel__wrapper">
        <button className="carusel__btn carusel__btn--prev" onClick={() => this.changeSlide()}>Prev</button>
        <div className="carusel__dataContainer">
          <ul className="carusel" style={styles}>
            {this.props.children.map((c, k) => <li key={k} className="carusel__item">{c}</li>)}
          </ul>
        </div>
        <button className="carusel__btn carusel__btn--next" onClick={() => this.changeSlide(true)}>Next</button>
      </div>
    );
  }
}

Carusel.defaultProps = {
  sizeFromNode: null
};

Carusel.propTypes = {
  children: PropTypes.array.isRequired,
  sizeFromNode: PropTypes.string
};

export default Carusel;
