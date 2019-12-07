import React, { Component } from 'react';

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

export default Addfolder;
