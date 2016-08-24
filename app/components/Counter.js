import React, { Component, PropTypes } from 'react';
// import { remote } from 'electron';
// import { dialog } from 'electron';
import { Link } from 'react-router';
import styles from './Counter.css';

const remote = require('electron').remote;
const dialog = remote.dialog;

class Counter extends Component {

  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  };

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

  }

  openFile(type) {
    dialog.showOpenDialog({
      title: 'Sélectionnez le fichier de définition',
      buttonLabel: 'Valider',
      filters: [ {name: 'Intl JSON', extensions: ['json']}, ],
      // properties: [ 'openFile' ]
    }, function(files) {
      console.log('file opened', type, files);
      if (!files) return

      const data = require(files[0])
      console.log('file content', data)
    })
  }

  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, save, counter } = this.props;
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {counter}
        </div>
        <div>
          <button onClick={() => this.openFile('default')}>
            Importer default
          </button>
          <input
            type="file"
            accept=".json"
            ref="default"
            onChange={ (e) => this.fileChanged(e)}/>
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment}>
            <i className="fa fa-plus" />
          </button>
          <button className={styles.btn} onClick={decrement}>
            <i className="fa fa-minus" />
          </button>
          <button className={styles.btn} onClick={incrementIfOdd}>odd</button>
          <button className={styles.btn} onClick={() => incrementAsync()}>async</button>
          <button className={styles.btn} onClick={() => save()}>save</button>
        </div>
      </div>
    );
  }
}

export default Counter;
