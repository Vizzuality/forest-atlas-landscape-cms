import React from "react"
import PropTypes from "prop-types"
import classnames from 'classnames';

class CoverPage extends React.Component {
  static propTypes = {
    size: PropTypes.oneOf(['big', 'small']),
    image: PropTypes.shape({
      url: PropTypes.string,
      attribution: PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
      })
    }),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    template: PropTypes.string,
  };

  static defaultProps = {
    size: 'big',
    image: {},
    title: null,
    subtitle: null,
    template: null,
  };

  /**
   * Code specific for the INDIA template
   */
  renderIndiaCover() {
    const { image, size, title } = this.props;

    if (size === 'big') {
      return (
        <div
          className="c-cover -big"
          style={image && image.url
            ? { backgroundImage: `url(${image.url})` }
            : {}
          }
        >
          <div className="wrapper">
            <div className="cover-elem-wrapper">
              <div className="cover_page_wrapper_envelope">
                <div className="cover-page-wrapper">
                  <div className="restoration_image_div">
                    <img className="restoration_image" alt="Logo" src="http:wri-sites.s3.amazonaws.com/ifmt/NationalAtlasPartnerLogo/Atlas/RO_Atlas_white_png.png" />
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
        className="c-cover"
        style={image && image.url
          ? { backgroundImage: `url(${image.url})` }
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
    const { image, size, title, subtitle, template } = this.props;

    if (template === 'INDIA') {
      return this.renderIndiaCover();
    }

    return (
      <div
        className={classnames({
          'c-cover': true,
          '-short': size === 'small'
        })}
        style={image && image.url
          ? { backgroundImage: `url(${image.url})` }
          : {}
        }
      >
        <div className="wrapper">
          { title && (
            <h2 className="cover-title">
              {title}
            </h2>
          )}
          { subtitle && (
            <h2 className="cover-subtitle">
              {subtitle}
            </h2>
          )}
        </div>

        {image.attribution && (
          <div className="cover-attribution">
            { image.attribution.url && (
              <a target="_blank" href={image.attribution.url} rel="noopener noreferrer">
                {image.attribution.label}
              </a>
            )}
            { !image.attribution.url && image.attribution.label && (
              <p>{image.attribution.label}</p>
            )}
          </div>
        )}

      </div>
    );
  }
}

export default CoverPage;
