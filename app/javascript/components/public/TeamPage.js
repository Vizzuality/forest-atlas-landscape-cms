import React from 'react';

class TeamPage extends React.Component {
  state = { show: false, member: {} }

  showModal = (member) => {
    this.setState({ show: true, member: member });
  }
  
  hideModal = () => {
    this.setState({ show: false });
  }
    
  render() {
    
    let cards = this.props.members.map((member, key) =>
    <div key={member.name} class="profile-card" onClick={()=>{this.showModal(member)}}>
      <div class="profile-header">
        <img src={member.url} alt="" />
      </div>
      <div class="profile-body">
        <div class="name">{member.name}</div>
        <div class="intro">
          <p>{member.designation}</p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="vizz-wysiwyg" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <Modal show={this.state.show} handleClose={this.hideModal} title={this.state.member.name}>
        {this.state.member.about}
      </Modal>
      <div class="profile-grid">
        {cards}
      </div>
    </div>
  )
  }
}

const Modal = ({ handleClose, show, title, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        <h2>{title}</h2>
        <a className="modal-close" onClick={handleClose}>&times;</a>
        {children}
      </section>
    </div>
  );
};

export default TeamPage;
