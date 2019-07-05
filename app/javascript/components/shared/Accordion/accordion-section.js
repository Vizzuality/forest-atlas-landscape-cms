import React, { Component } from "react";
import PropTypes from "prop-types";

class AccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label }
    } = this;

    return (
      <div
        style={{
          background: isOpen ? "white" : "white",
          borderTop: "0.5px solid #9b9b9b",
          padding: "10px 15px"
        }}
      >
        <div onClick={onClick} style={{ cursor: "pointer", color: "#F0AB00", fontSize:'30px' }}>
          <div>{label}
            <div style={{ float: "right" }}>
              {!isOpen && <span><b>+</b></span>}
              {isOpen && <span><b>-</b></span>}
            </div>
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              marginTop: 0,
              padding: "0px 5px"
            }}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;
