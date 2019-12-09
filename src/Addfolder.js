import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Addfolder extends Component {
  render() {
    return (
      <form className='Addfolder'>
        <input
          type='text'
          name='text'
          id='addfolder'
          value={this.props.text}
          onChange={this.props.onChangeFolder}
        ></input>
        <button type='button' onClick={this.props.handleAddFolder}>
          add Folder
        </button>
      </form>
    );
  }
}

Addfolder.propTypes = {
  text: PropTypes.string,
  onChangeFolder: PropTypes.func,
  handleAddFolder: PropTypes.func
};

export default Addfolder;
