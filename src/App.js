import React, { Component } from 'react';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: [],
      onChangeFolder: '',
      onChangeNote: '',
      slectedFolder: '',
      noteTxtArea: ''
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

    console.log('handle add folder from made it', this.state.onChangeFolder);

    fetch('http://localhost:9090/folders', {
      method: 'post',
      body: JSON.stringify({ name: this.state.onChangeFolder })
    })
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        console.log('data', data);
        const newelement = {
          id: data.id,
          name: this.state.onChangeFolder
        };
        console.log('newElement', newelement);
        //newelement.name = this.state.onChangeFolder
        this.setState({ folders: [...this.state.folders, newelement] });
      });

    // const data = FormData(e.target.value);
    // console.log(this.state.onChangeFolder);
  }

  handleAddNote = e => {
    e.preventDefault();
    console.log(this.state.selectedFolder);
    fetch('http://localhost:9090/notes', {
      method: 'post',
      body: JSON.stringify({
        name: this.state.onChangeNote,
        folderId: this.state.selectedFolder,
        content: this.state.noteTxtArea
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        console.log('data', data);
        const newelement = {
          id: data.id,
          name: this.state.onChangeNote,
          folderId: this.state.selectedFolder,
          content: this.state.noteTxtArea
        };
        console.log('newElement', newelement);
        //newelement.name = this.state.onChangeFolder
        this.setState({ notes: [...this.state.notes, newelement] });
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
    this.setState({ selectedFolders: e.target.value });
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
            <Addfolder
              handleAddFolder={this.handleAddFolder}
              onChangeFolder={this.onChangeFolder}
              text={this.state.onChangeFolder}
              {...props}
            />
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
              slectedFolder={this.state.slectedFolder}
              noteFolderIdChange={this.noteFolderIdChange}
              textArea={this.state.noteTxtArea}
              onChangeNoteTxtArea={this.onChangeNoteTxtArea}
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
    console.log(this.state.folders);
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

export default App;
