import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Notification from 'components/Notification';
import Cover from './Cover';
import HomePage from './HomePage';
import StaticPage from './StaticPage';

export default function PreviewStatic({ siteSettings, homepage, opencontent }) {
  const [isHomepage, setIsHomepage] = useState(true);

  const onClickHomepage = useCallback(() => setIsHomepage(true), [setIsHomepage]);
  const onClickOpenContent = useCallback(() => setIsHomepage(false), [setIsHomepage]);

  const clickHandler = useCallback(() => {
    setIsHomepage(!isHomepage);
  }, [isHomepage, setIsHomepage]);

  const StaticHeader = () => {
    const countryColors = window.gon.header_country_colours || [];
    const showLogin = !(window.gon.header_login_enabled === 'false');

    return (
      <header className="c-header js-header initialized">
        <div className="mobile-drawer js-mobile-drawer">
          <div className="wrapper">
            <ul>
              <li className={classnames({ 'button-item': true, '-active': !isHomepage })}>
                <button type="button" onClick={clickHandler}>Open Content</button>
              </li>
              <li className="dropdown-item">
                <a>Sample menu</a>
                <ul>
                  <li>
                    <a>Level 1 Page</a>
                  </li>
                </ul>
              </li>
              <li>
                <form method="get" action="/search_results">
                  <div className="c-input-search">
                    <input type="input" placeholder="Search" name="search" />
                    <button type="submit">Search</button>
                  </div>
                </form>
              </li>
            </ul>
          </div>
        </div>
        <div className="mobile-menu wrapper">
          <div className="logo-container">
            <button type="button" className="logo" onClick={onClickHomepage}>
              Logo
            </button>
          </div>
          <div className="hamburger-menu js-mobile-menu">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="desktop-menu wrapper">
          <div className="logo-container">
            <button type="button" className="logo" onClick={onClickHomepage}>
              Logo
            </button>
          </div>
          <div className="menu-container">
            <div className="menu">
              <ul>
                <li className={classnames({ 'button-item': true, '-active': !isHomepage })}>
                  <button type="button" onClick={clickHandler}>Open Content</button>
                </li>
                <li className="dropdown-item">
                  <a>Sample menu</a>
                  <ul>
                    <li>
                      <a>Level 1 Page</a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown-item search js-search">
                  <button type="button" className="search-button js-search-button">Search</button>
                </li>
              </ul>
              <ul>
                {showLogin ? <li><a>Login</a></li> : null}
              </ul>
            </div>
            <div className="sub-menu">
              <div className="content">
                <ul className="breadcrumbs">
                  {!isHomepage && (
                    <>
                      <li className="button-item">
                        <button type="button" onClick={onClickHomepage}>Home</button>
                      </li>
                      &nbsp;
                      <li className="button-item">
                        <button type="button" onClick={onClickOpenContent}>Open Content</button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flag-border">
          {countryColors.map(color => <div style={{ backgroundColor: color }} />)}
        </div>
      </header>
    );
  };

  return (
    <div className="l-template-preview">
      <Notification
        type="warning"
        content="The content of this preview is not representative of the real content of the site."
        additionalContent={(
          <>
            Click here to preview the{' '}
            <button
              type="button"
              className={classnames({
                'c-button': true,
                '-monochrome': true,
                '-mini': true,
                '-outline': !isHomepage
              })}
              aria-pressed={isHomepage}
              onClick={onClickHomepage}
            >
              Homepage
            </button>{' '}
            or an{' '}
            <button
              type="button"
              className={classnames({
                'c-button': true,
                '-monochrome': true,
                '-mini': true,
                '-outline': isHomepage
              })}
              aria-pressed={!isHomepage}
              onClick={onClickOpenContent}
            >
              Open Content
            </button>{' '}
            page.
          </>
        )}
        closeable={false}
        onClose={() => {}}
      />
      <StaticHeader />
      <Cover {...(isHomepage ? homepage.cover : opencontent.cover)} />
      {isHomepage ? <HomePage {...homepage} /> : <StaticPage {...opencontent} />}
    </div>
  );
}

PreviewStatic.propTypes = {
  siteSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  homepage: PropTypes.shape({}).isRequired,
  opencontent: PropTypes.shape({}).isRequired,
};
