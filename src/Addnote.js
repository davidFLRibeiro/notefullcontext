import React, { Component } from 'react';

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

export default Addnote;
