import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { Icon } from 'components';

import { settingsUtils } from 'utils';

class Footer extends React.PureComponent {
  getShareUrl(service) {
    const { site } = this.props;

    const availableServices = {
      facebook: 'http://www.facebook.com/sharer.php',
      twitter: 'https://twitter.com/share',
      gplus: 'https://plus.google.com/share',
      linkedin: 'https://www.linkedin.com/shareArticle'
    }

    const servicesParams = {};

    if (service === 'linkedin') {
      servicesParams.url = window.location.href;
      servicesParams.title = `${site.page.name}-${site.current.name}`;
      servicesParams.summary = site.page.description;
    } else if (service === 'facebook') {
      servicesParams.u = window.location.href;
    } else {
      servicesParams.url = window.location.href;
    }

    return availableServices[service] + `?${queryString.stringify(servicesParams)}`;
  }

  renderContactInfo() {
    return (
      <li className="site-link-item">
        <a href="/feedback" className="site-link">
          Contact us
        </a>
      </li>
    );
  }

  getTermsLabel(){
    const { siteTemplateName } = this.props.site.meta;
    let terms_label = "Terms of Service";

    if (siteTemplateName == 'INDIA') {
      terms_label = "Terms & Conditions";
    }

    return terms_label;
  }

  preFooter() {
    const { settings } = this.props.site;
    return (
      <div className="c-pre-footer">
        <div
          className="wrapper"
          dangerouslySetInnerHTML={{ __html: settingsUtils.getValue('pre_footer', settings) }}
        />
      </div>
    );
  }

  render () {
    const { settings } = this.props.site;

    return (<div>

      {settingsUtils.isset(settingsUtils.find('pre_footer', settings)) && this.preFooter()}

      <footer className="c-footer">
        <div className="wrapper">
          <ul className="site-links-list">

          <li className="site-link-item">
            <a href="/terms-and-privacy" className="site-link">{this.getTermsLabel()}</a>
          </li>

          <li className="site-link-item">
            <a href="/privacy-policy" className="site-link">Privacy Policy</a>
          </li>

          {settingsUtils.isset(settingsUtils.find('contact_email_address', settings)) && this.renderContactInfo()}

          </ul>
          <div className="share">
            <span className="share-text">Share the Atlas</span>
            <ul className="share-links-list">
              <li className="share-link-item">
                <a className="share-link -facebook" href={this.getShareUrl('facebook')} target="_blank" rel="noopener noreferrer">
                  <Icon name="icon-Facebook" className="icon icon-Facebook"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -twitter" href={this.getShareUrl('twitter')} target="_blank" rel="noopener noreferrer">
                  <Icon name="icon-Twitter" className="icon icon-Twitter"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -googleplus" href={this.getShareUrl('gplus')} target="_blank" rel="noopener noreferrer">
                  <Icon name="icon-Google" className="icon icon-Google"  />
                </a>
              </li>
              <li className="share-link-item">
                <a className="share-link -linkedin" href={this.getShareUrl('linkedin')} target="_blank" rel="noopener noreferrer">
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
