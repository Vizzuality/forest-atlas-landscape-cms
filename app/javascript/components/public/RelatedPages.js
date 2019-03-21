import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class RelatedPages extends PureComponent {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })).isRequired
  };

  render() {
    const { pages } = this.props;
    return (
      <div className="c-related-pages">
        <h3>Related content</h3>
        {pages.map(page => (
          <a href={page.url} key={page.url}>
            <div className="title">{page.name}</div>
            <div className="description">
              {`${(page.description || '').slice(0, 150)}${page.description && page.description.length > 150 ? '...' : ''}`}
            </div>
          </a>
        ))}
      </div>
    );
  }
}

export default RelatedPages;
