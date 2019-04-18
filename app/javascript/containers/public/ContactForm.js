import React from "react";
import PropTypes from "prop-types";

import PublicContainer from "containers/shared/PublicContainer";
import { Footer } from "components";
import ContactForm from "components/public/ContactForm";

class ContactFormContainer extends PublicContainer {
  render() {
    return (
      <div>
        <ContactForm {...this.props} />
        <Footer {...this.store.getState()} />
      </div>
    );
  }
}

export default ContactFormContainer;
