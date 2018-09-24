import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';

export default class PublicDashboard extends PublicContainer {
  render() {
    const { content } = this.props.page;
    return (
      <div>
        <Wysiwyg
          readOnly
          items={JSON.parse(content).length ? JSON.parse(content) : []}
          blocks={['text']}
        />
        {/* <WidgetReports /> */}
      </div>
    );
  }
}
