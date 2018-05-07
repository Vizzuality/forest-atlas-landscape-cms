import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock } from 'components/wysiwyg';

import WidgetReports from 'components/WidgetReports';

export default class PublicDashboard extends PublicContainer {
  render() {
    const { content } = this.props.page;
    return (
      <div>
        <Wysiwyg
          readOnly
          items={JSON.parse(content).length ? JSON.parse(content) : []}
          blocks={{
            widget: {
              Component: WidgetBlock,
              label: 'Visualization'
            }
          }}
        />
        {/* <WidgetReports /> */}
      </div>
    );
  }
}
