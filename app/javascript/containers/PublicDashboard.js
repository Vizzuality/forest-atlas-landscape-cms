import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import Wysiwyg from 'vizz-wysiwyg';

export default class PublicDashboard extends PublicContainer {
  render() {
    const { content } = this.props.page;
    return <Wysiwyg readOnly items={content.length ? content : []} />;
  }
}
