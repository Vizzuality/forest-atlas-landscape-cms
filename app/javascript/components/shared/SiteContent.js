import React from 'react';
import PropTypes from 'prop-types';

import ReactQuill from 'react-quill';

const quillModules = {
  toolbar: {
    container: [
      'bold',
      'italic',
      'underline',
      { header: 1 },
      { header: 2 },
      'intro',
      'blockquote',
      'link',
      { 'align': '' },
      { align: 'center' },
      { align: 'right' },
      { indent: '+1' },
      { indent: '-1' },
      { list: 'bullet' },
      { list: 'ordered' },
      'clean'
    ]
  }
};

// TODO: This will also allow edit mode in admin, for now we are just rendering the contents for the end-user
class SiteContent extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="c-content">
        <div className="wrapper">
          <ReactQuill
            value={content}
            theme="bubble"
            readOnly
            serializedContent={false}
            maxImageSize={{
              width: 1280,
              height: 853
            }}
            modules={quillModules}
          />
        </div>
      </div>
    )
  }
}

export default SiteContent;
