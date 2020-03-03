import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route, Link } from 'react-router-dom';
import NoteListNav from './NoteListNav/NoteListNav';
import NotePageNav from './NotePageNav/NotePageNav';
import NoteListMain from './NoteListMain/NoteListMain';
import NotePageMain from './NotePageMain/NotePageMain';
import ApiContext from './ApiContext';
import Addfolder from './Addfolder';
import config from './config';
import Addnote from './Addnote';
import './App.css';
import notefulcontext from './context/contextState';
import NoteFullError from './NoteFullError';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: [],
      onChangeFolder: '',
      onChangeNote: '',
      selectedFolder: '',
      noteTxtArea: '',
      isValid: false,
      isNoteValid: false
    };
    this.handleAddFolder = this.handleAddFolder.bind(this);
    this.onChangeFolder = this.onChangeFolder.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));

        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders, selectedFolder: folders[0].id });
      })
      .catch(error => {
        console.error({ error });
      });
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  handleAddFolder(e) {
    e.preventDefault();
    //`${config.API_ENDPOINT}/folders`
    // console.log('handle add folder from made it', this.state.onChangeFolder);
    if (this.state.onChangeFolder.length === 0) {
      return this.setState({ isValid: true });
    }
    const folder = {
      name: this.state.onChangeFolder
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      body: JSON.stringify(folder),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(data => {
        //name.value = this.state.onChangeFolder;
        //this.context.addFolder(data);
        this.setState(folders => {
          const updatedFolder = this.state.folders.push(data);
          return {
            updatedFolder,
            onChangeFolder: ''
          };
        });
        this.props.history.push('/');
      })
      .catch(error => {
        console.log(error);
      });

    // const data = FormData(e.target.value);
    // console.log(this.state.onChangeFolder);
  }

  handleAddNote = e => {
    e.preventDefault();
    if (
      this.state.onChangeNote.length === 0 ||
      this.state.noteTxtArea.length === 0
    ) {
      return this.setState({ isNoteValid: true });
    }
    // const { name, content, folderId } = e.target;
    const note = {
      name: this.state.onChangeNote,
      content: this.state.noteTxtArea,
      folderId: this.state.selectedFolder,
      modified: new Date().toISOString().slice(0, 10)
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(data => {
        // name.value = this.state.onChangeNote;
        // content.value = this.state.noteTxtArea;
        // folderId.value = this.state.slectedFolder;
        this.setState(notes => {
          const updatedNote = this.state.notes.push(data);
          return {
            updatedNote,
            onChangeNote: '',
            onChangeFolder: '',
            noteTxtArea: ''
          };
        });
        this.props.history.push('/');
      })
      .catch(error => {
        console.error(error);
      });
    // const data = FormData(e.target.value);
    // console.log(this.state.onChangeFolder);
  };

  onChangeFolder(e) {
    e.preventDefault();
    console.log('made it', e.target.value);
    this.setState({ onChangeFolder: e.target.value });
  }
  onChangeNote(e) {
    e.preventDefault();
    console.log('made it notes here', e.target.value);
    this.setState({ onChangeNote: e.target.value });
  }

  noteFolderIdChange = e => {
    e.preventDefault();
    console.log('note folder change', e.target.value);
    this.setState({ selectedFolder: e.target.value });
  };

  onChangeNoteTxtArea = e => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ noteTxtArea: e.target.value });
  };

  renderNavRoutes() {
    return (
      <notefulcontext.Provider>
        {['/', '/folder/:folderId'].map(path => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path='/note/:noteId' component={NotePageNav} />
        <Route
          path='/add-folder'
          render={props => (
            <NoteFullError>
              <Addfolder
                handleAddFolder={this.handleAddFolder}
                onChangeFolder={this.onChangeFolder}
                text={this.state.onChangeFolder}
                isValid={this.state.isValid}
                {...props}
              />
            </NoteFullError>
          )}
        />

        <Route path='/add-note' component={NotePageNav} />
      </notefulcontext.Provider>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path='/note/:noteId' component={NotePageMain} />
        <Route
          path='/add-note'
          render={props => (
            <Addnote
              folders={this.state.folders}
              handleAddNote={this.handleAddNote}
              onChangeNote={this.onChangeNote}
              text={this.state.onChangeNote}
              selectedFolder={this.state.selectedFolder}
              noteFolderIdChange={this.noteFolderIdChange}
              textArea={this.state.noteTxtArea}
              onChangeNoteTxtArea={this.onChangeNoteTxtArea}
              isNoteValid={this.state.isNoteValid}
              {...props}
            />
          )}
        />
      </>
    );
  }
  static contextType = notefulcontext;

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote
    };
    console.log(this.state.folders, this.state.notes);
    return (
      <ApiContext.Provider value={value}>
        <div className='App'>
          <nav className='App__nav'>{this.renderNavRoutes()}</nav>
          <header className='App__header'>
            <h1>
              <Link to='/'>Noteful</Link>{' '}
            </h1>
          </header>
          <main className='App__main'>{this.renderMainRoutes()}</main>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default withRouter(App);
