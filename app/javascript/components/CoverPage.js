import React from "react"
import PropTypes from "prop-types"
import classnames from 'classnames';
import Slider from 'react-slick';


class CoverPage extends React.Component {
  static propTypes = {
    size: PropTypes.oneOf(['big', 'small']),
    images: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      attribution: PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
      })
    })),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    template: PropTypes.string,
  };

  static defaultProps = {
    size: 'big',
    images: [],
    title: null,
    subtitle: null,
    template: null,
  };

  /**
   * Code specific for the INDIA template
   */
  renderIndiaCover() {
    const { images, size, title } = this.props;

    if (size === 'big') {
      return (
        <div
          className="c-cover"
          style={images.length && images[0].url
            ? { backgroundImage: `url(${images[0].url})` }
            : {}
          }
        >
          <div className="wrapper">
            <div className="cover-elem-wrapper">
              <div className="cover_page_wrapper_envelope">
                <div className="cover-page-wrapper">
                  <div className="restoration_image_div">
                    <img className="restoration_image" alt="Logo" src="http://wri-sites.s3.amazonaws.com/ifmt/NationalAtlasPartnerLogo/Atlas/RO_Atlas_white_png.png" />
                  </div>

                  <div className="hr_div"> <hr className="hr-homepage" /> </div>
                  <div className="atlas_flex_div">
                    <div className="button_wrapper">
                      <a href="/atlas" className="home_page_atlas_button"> Launch Atlas </a>
                    </div>
                  </div>

                  <p className="cover-title-para">{title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="c-cover -short"
        style={images.length && images[0].url
          ? { backgroundImage: `url(${images[0].url})` }
          : {}
        }
      >
        <div className="wrapper">
          <h2 className="cover-title-left-other-page">{title}</h2>
        </div>
      </div>
    );
  }


  render() {
    const { images, size, title, subtitle, template } = this.props;

    if (template === 'INDIA') {
      return this.renderIndiaCover();
    }

    const sliderSettings = {
      infinite: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 4000,
      fade: true,
      cssEase: 'linear',
    };

    return (
      <div
        className={classnames({
          'c-cover': true,
          '-short': size === 'small'
        })}
        style={images.length && images[0].url && size === 'small'
          ? { backgroundImage: `url(${images[0].url})` }
          : {}
        }
      >
        {size === 'big' && images.length > 0 && (
          <Slider {...sliderSettings}>
            {images.map(image => (
              <div className="slide" key={image.url}>
                <div
                  className="background"
                  style={{ backgroundImage: `url(${image.url})` }}
                />

                {image.attribution && (
                  <div className="cover-attribution">
                    {image.attribution.url && (
                      <a target="_blank" href={image.attribution.url} rel="noopener noreferrer">
                        {image.attribution.label}
                      </a>
                    )}
                    {!image.attribution.url && image.attribution.label && (
                      <p>{image.attribution.label}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Slider>
        )}
        <div className="wrapper">
          {title && (
            <h2 className="cover-title">
              {title}
            </h2>
          )}
          {subtitle && (
            <h2 className="cover-subtitle">
              {subtitle}
            </h2>
          )}
        </div>

      </div>
    );
  }
}

export default CoverPage;
