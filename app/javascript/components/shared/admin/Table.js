import React from "react"
import PropTypes from "prop-types"

export default function Table({ columns, data }) {
  return (
    <div className="c-table">
      <table role="grid">
          boop
      </table>
    </div>
  );
}

Table.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};
