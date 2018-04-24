import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { Icon } from 'components';

import { settingsUtils } from 'utils';

class Footer extends React.PureComponent {
  getShareUrl(service) {
    const { site } = this.props;

    const availableServices = {
      facebook: 'http://www.facebook.com/sharer.php?u=',
      twitter: 'https://twitter.com/share?url=',
      gplus: 'https://plus.google.com/share?url=',
      linkedin: 'https://www.linkedin.com/shareArticle?url='
    }

    if (service === 'linkedin') {
      const linkedInParams = {
        url: window.location.href,
        title: `${site.page.name}-${site.current.name}`,
        summary: site.page.description
      }
      return availableServices['linkedin'] + `?${queryString.stringify(linkedInParams)}`;
    }

    const servicesParams = {
      url: window.location.href
    }

    return availableServices[service] + `?${queryString.stringify(servicesParams)}`;
  }

  listSeperator() {
    return <li className="separator"> |</li>;
  }

  renderContactInfo() {
    const { settings } = this.props.site;
    return (<li
      className="site-link-item">
        <a href={`mailto: ${settingsUtils.getValue('contact_email_address', settings)}`}
          className="site-link">Contact us</a>
      </li>);
  }

  preFooter() {
    const { settings } = this.props.site;
    return (
      <div class="c-pre-footer">
        <div class="wrapper">
          {settingsUtils.getValue('pre_footer', settings)}
        </div>
      </div>
    )
  }

  render () {
    const { settings } = this.props.site;

    return (<div>

      {settingsUtils.isset(settingsUtils.find('pre_footer', settings)) && this.preFooter()}

      <footer className="c-footer">
        <div className="wrapper">
          <ul className="site-links-list">

          <li className="site-link-item">
            <a href="/terms-and-privacy" className="site-link">Terms of Service</a>
          </li>

          {settingsUtils.isset(settingsUtils.find('contact_email_address', settings)) &&
            this.listSeperator() && this.renderContactInfo()}

          </ul>
          <div className="share">
            <span className="share-text">Share the Atlas</span>
            <ul className="share-links-list">
              <li className="share-link-item">
                <a className="share-link -facebook" href={this.getShareUrl('facebook')} target="_blank">
                  <Icon name="icon-Facebook" className="icon icon-Facebook"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -twitter" href={this.getShareUrl('twitter')} target="_blank">
                  <Icon name="icon-Twitter" className="icon icon-Twitter"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -googleplus" href={this.getShareUrl('gplus')} target="_blank">
                  <Icon name="icon-Google" className="icon icon-Google"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -linkedin" href={this.getShareUrl('linkedin')} target="_blank">
                  <Icon name="icon-Linkedin" className="icon icon-Linkedin"  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>)
  }
}

Footer.propTypes = {

};

export default Footer;
