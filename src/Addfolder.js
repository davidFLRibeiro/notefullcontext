import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Addfolder extends Component {
  render() {
    return (
      <div>
        <form
          className='Addfolder'
          onSubmit={this.props.handleAddFolder}
          noValidate
        >
          <input
            type='text'
            name='text'
            id='addfolder'
            value={this.props.text}
            onChange={this.props.onChangeFolder}
            required
          ></input>
          <button type='submit'>add Folder</button>
        </form>

        <div className='res-block'>
          {this.props.isValid && <p>ERROR: folder name can not be empty</p>}
        </div>
      </div>
    );
  }
}

Addfolder.propTypes = {
  text: PropTypes.string,
  onChangeFolder: PropTypes.func,
  handleAddFolder: PropTypes.func
};

export default Addfolder;
