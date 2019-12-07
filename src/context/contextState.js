import React from 'react';

const notefulcontext = React.createContext({
  notes: [],
  folders: [],
  onChangeFolder: ''
});

export default notefulcontext;
