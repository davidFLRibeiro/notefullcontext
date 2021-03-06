import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import { findNote, findFolder } from '../notes-helpers';
import { countNotesForFolder } from '../notes-helpers';
import './NoteListNav.css';
import Addfolder from '../Addfolder';

export default class NoteListNav extends React.Component {
  static contextType = ApiContext;

  render() {
    const { folders = [], notes = [] } = this.context;
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder => (
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <br />
            Folder
          </CircleButton>
        </div>
      </div>
    );
  }
}
