/* globals FileReader, alert */
import React from 'react'
import reactStamp from 'react-stamp'

// import { Link } from 'react-router'
// <Link to="/counter">to Counter</Link>

const { object, func } = React.PropTypes

function storeFileContent(name, file, store) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;
    try {
      const data = JSON.parse(text)
      store(name, file, data)
    } catch(e) {
      console.error(e)
      alert("Fichier non conforme")
    }
  };

  reader.readAsText(file);
}

function parseFileContent(name, str) {
  
}

export default reactStamp(React).compose({

  propTypes: {
    files    : object.isRequired,
    storeFile: func.isRequired,
  },

  fileChanged(evt, name) {
    const files = evt.target.files;
    const { storeFile } = this.props
    if (!files.length) return; // + clear, etc...
    storeFileContent(name, files[0], storeFile)
  },

  render() {
    const { files: { defaultMsg, catalog }} = this.props
    return (
      <div>
        <h2>Translation Editor</h2>
        <div>
          <input type="file" accept=".json" onChange={ (e) => this.fileChanged(e, 'defaultMsg') } />
          {
            defaultMsg && <span>{ defaultMsg.name }</span>
          }
          <input type="file" accept=".json" onChange={ (e) => this.fileChanged(e, 'catalog') } />
        </div>

      </div>
    );
  }
// }
})

/*
export default reactStamp(React).compose({

  displayName: 'Home',

  propTypes: {
    files    : object.isRequired,
    openFile : func.isRequired,
    storeFile: func.isRequired,
  },

  fileChanged(evt) {
    const files = evt.target.files;
    console.log(files);
    if (!files.length) return; // + clear, etc...
    const file = files[0]
    // const el = this.refs[refName]

    console.log(file);
    const reader = new FileReader();

    reader.onload = function(e) {
      const text = e.target.result;

      try {
        const data = JSON.parse(text)
        console.log('JSON', data);
      } catch(e) {
        console.log('Fichier non valide')
      }
    };

    reader.readAsText(file);

  },

  render() {
    return (
      <div>
        <h2>Translation Editor</h2>

        <div>
          <input type="file" onChange={ (e) => this.fileChanged(e, 'default') } />
          <input type="file" onChange={ (e) => this.fileChanged(e, 'catalog') } />
        </div>

      </div>
    );
  }

})
*/
