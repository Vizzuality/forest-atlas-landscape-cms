import React, { Component } from 'react';
import Accordion from "components/shared/Accordion";
import Wysiwyg from 'components/shared/Wysiwyg';

const removeHTMLTagsAndQuotes = (content) => {
  return content.replace(/<\/?[^>]+(>|$)/g, "").replace(/\"/g, '')
}

export class AccordionWrapper extends Component {

  render() {
  const panels = [];
    for (let i = 0; i < this.props.contents.length; i = i + 2) {
      if (i % 2 == 0) {
        panels.push(
          <div label={removeHTMLTagsAndQuotes(this.props.contents[i].content)}>
            <Wysiwyg style={{ maxWidth: '100%', paddingLeft: '0px' }} readOnly items={[this.props.contents[i+1]]} />
          </div>
        )
      };
    }
    return (<div className="cw-wysiwyg" style={{ paddingTop: '10px', paddingBottom: '20px', width: '100%', maxWidth: '1080px' }}>
      <Accordion>
        {panels}
      </Accordion>
    </div>);
  }

}
