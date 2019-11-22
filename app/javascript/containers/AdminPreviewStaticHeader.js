import React from 'react';

export default function AdminPreviewStaticHeader() {
  // const MobileDrawer = () => (
  //   <div className="mobile-drawer js-mobile-drawer">
  //     <div className="wrapper">
  //       <ul>
  //         Pages
  //       </ul>
  //       <ul>
  //         <li className="notranslate js-language-selector-mobile" />
  //       </ul>
  //       <ul>
  //         User
  //       </ul>
  //     </div>
  //   </div>
  // );
  // const MobileMenuWrapper = () => (
  //   <div className="mobile-menu wrapper">
  //   </div>
  // );
  // const DesktopMenuWrapper = () => (
  //   <div className="desktop-menu wrapper">
  //   </div>
  // );
  // const FlagBorder = ({countryColors = []}) => (
  //   <div className="flag-border">
  //     {countryColors.map(color => (
  //       <div style={{ backgroundColor: color }} />
  //     ))}
  //   </div>
  // );

  // const InteractiveHeader = (
  //   <header className="c-header js-header">
  //     <MobileDrawer />
  //     <MobileMenuWrapper />
  //     <DesktopMenuWrapper />
  //     <FlagBorder />
  //   </header>
  // );

  return (
    <header className="c-header js-header initialized">
      <div className="mobile-drawer js-mobile-drawer">
        <div className="wrapper">
          <ul>
            <li><a href="/root-level">Root level</a></li>
            <li>
              <ul>
                <li>
                  <a href="/root-level/level-1">Level 1 Page</a>
                </li>
                <li>
                  <ul>
                    <li><a href="/root-level/level-1/level-2">Level 2 Page</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="/map" data-turbolinks="false">Map</a></li>
            <li>
              <form method="get" action="/search_results">
                <div className="c-input-search">
                  <input type="input" placeholder="Search" name="search" />
                  <button type="submit">Search</button>
                </div>
              </form>
            </li>
          </ul>
          <ul>
            <li className="notranslate js-language-selector-mobile" />
          </ul>
          <ul>
            <li className="dropdown-item">
              <div className="profile-image">
                mi
              </div>
              <ul>
                <li>
                  <a href="#" className="triggerMySubscriptions">My Subscriptions</a>
                </li>
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="mobile-menu wrapper">
        <div className="logo-container" href="/">
          <a className="logo " href="/">
            <img alt="Logo" src="/system/site_settings/images/000/001/441/original/rr.PNG?1572967304" />
          </a>
        </div>
        <div className="hamburger-menu js-mobile-menu">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="desktop-menu wrapper">
        <div className="logo-container">
          <a className="logo " href="/">
            <img alt="Logo" src="/system/site_settings/images/000/001/441/original/rr.PNG?1572967304" />
          </a>
        </div>
        <div className="menu-container">
          <div className="menu">
            <ul>
              <li className="dropdown-item -active">
                <a href="/root-level">Root level</a>
                <ul>
                  <li>
                  </li>
                  <li>
                    <a href="/root-level/level-1">Level 1 Page</a>
                  </li>
                </ul>
              </li>
              <li className="">
                <a href="/map" data-turbolinks="false">Open Content</a>
              </li>
              <li className="dropdown-item search js-search">
                <button type="button" className="search-button js-search-button" href="#">Search</button>
                <ul>
                  <li>
                    <form method="get" action="/search_results">
                      <div className="c-input-search">
                        <input type="input" placeholder="Search" name="search" />
                        <button type="submit">Search</button>
                      </div>
                    </form>
                  </li>
                </ul>
              </li>
            </ul>
            <ul>
              <li className="notranslate js-language-selector" />
            </ul>
          </div>
          <div className="sub-menu">
            <div className="content">
              <ul className="breadcrumbs">
                <li><a href="/">Home</a></li>
                <li><a href="/root-level">Root level</a></li>
                <li><a href="/root-level/level-1">Level 1 Page</a></li>
                <li><a href="/root-level/level-1/level-2">Level 2 Page</a></li>
              </ul>
              <ul className="sections">
                <ul>
                  <li className="-active"><a href="/root-level/level-1/level-2">Level 2 Page</a></li>
                </ul>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flag-border">
        <div style={{backgroundColor: '#000'}} />
      </div>
    </header>
  );
}
