import React from 'react';
import PropTypes from 'prop-types';

class Carusel extends React.Component {
  constructor(props) {
    super(props);

    // Make this dynamic when time
    this.margin = 20;
    this.width = 360;
    this.inView = 3;

    this.state = {
      slides: null
    };
  }

  componentWillMount() {
    this.setState({ slides: this.props.children });
  }

  changeSlide(forw) {
    const newSlides = [...this.state.slides];

    if (forw) {
      const pushToEnd = newSlides.shift();
      newSlides.push(pushToEnd);
    } else {
      const lastSlide = newSlides[newSlides.length - 1];
      newSlides.splice(newSlides.length - 1, 1);
      newSlides.unshift(lastSlide);
    }

    this.setState({ slides: newSlides });
  }

  render() {
    return (
      <div className="carusel__wrapper">
        <button className="carusel__btn carusel__btn--prev" onClick={() => this.changeSlide()}>Prev</button>
        <div className="carusel__dataContainer">
          <ul className="carusel">
            {this.state.slides.map((c, k) => <li key={k} className="carusel__item">{c}</li>)}
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
