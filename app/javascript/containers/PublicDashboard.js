import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import Wysiwyg, { TextBlock } from 'vizz-wysiwyg';

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
            text: {
              Component: TextBlock,
              placeholder: 'Type your text',
              theme: 'bubble',
              modules: {
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  [{ align: [] }]
                ]
              }
            },
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
