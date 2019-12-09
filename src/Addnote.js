import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Addnote extends Component {
  render() {
    return (
      <form className='AddNote'>
        <input
          type='text'
          name='text'
          id='addnote'
          value={this.props.text}
          onChange={this.props.onChangeNote}
        ></input>
        <select
          value={this.props.slectedFolder}
          onChange={this.props.noteFolderIdChange}
        >
          {this.props.folders.map(folder => {
            return (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            );
          })}
        </select>
        <textarea
          value={this.props.textArea}
          onChange={this.props.onChangeNoteTxtArea}
        />
        <button type='button' onClick={this.props.handleAddNote}>
          add Note
        </button>
      </form>
    );
  }
}

Addnote.propTypes = {
  text: PropTypes.string,
  onChangeNote: PropTypes.func,
  handleAddFolder: PropTypes.func,
  slectedFolder: PropTypes.string,
  noteFolderIdChange: PropTypes.func,
  textArea: PropTypes.string,
  onChangeNoteTxtArea: PropTypes.func,
  handleAddNote: PropTypes.func
};

export default Addnote;
