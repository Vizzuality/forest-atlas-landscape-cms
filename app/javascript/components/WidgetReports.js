import React from 'react';
import PropTypes from 'prop-types';

import Carusel from 'components/Carusel';

export default function WidgetReports() {
  return (
    <section className="fa-dashboard__reports" id="reports">
      <h1>More reports</h1>
      <p>Ut egestas varius commodo. Duis venenatis suscipit efficitur. In et nulla blandit,
         ornare enim non, vehicula augue. Duis ornare turpis massa, nec consequat quam feugiat quis
      </p>

      <Carusel inView={3}>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 1</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 2</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 3</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 4</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 5</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 6</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
        <section className="fa-dashboard__reportPreview">
          <h4>Report title 7</h4>
          <p>Integer nisl mauris, egestas vel ultricies sit amet, mollis vel arcu.
              Donec at congue nunc. Integer gravida massa.</p>
        </section>
      </Carusel>

    </section>
  );
}

WidgetReports.propTypes = {

};
