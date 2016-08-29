/* globals FileReader, alert, confirm */
import R from 'ramda'
import React from 'react'
import reactStamp from 'react-stamp'
import { connect } from 'react-redux'

import { setDirty, isDirty } from 'lib/dirty'

import * as fileMod from 'redux/modules/files.mod'
import * as tuMod from 'redux/modules/transunit.mod'

const { object, func } = React.PropTypes

function storeFileContent(name, file, store) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;

    try {
      const data = JSON.parse(text)

      // File validation
      const errors = validateFileData(name, data);
      if (errors.length) {
        throw new Error('Invalid ' + errors.join(', '))
      }

      store(name, file, data)

    } catch(e) {
      alert("Unsupported file format or file content")
    }
  };

  reader.readAsText(file);
}

function validateFileData(name, data) {
  const fileDesc = R.find(R.propEq('name', name), fileMod.FILE_DESC)

  if (!fileDesc) return ['unsupported file type']

  return R.reduce( (errors, valid) => {
      if (!valid.fn(data)) errors.push(valid.code)
      return errors
    }, [], fileDesc.validators)
}

/**
 * @param current {Object} current files
 * @param next    {Object} next files
 */
function filesChanged(current, next) {
  const changes = fileMod.FILE_DESC.map( d => {
    return !R.equals(R.path(['name'], current[d.name]), R.path(['name'], next[d.name]))
  })
  return R.any(R.identity, changes)
}

const Files = reactStamp(React).compose({

  propTypes: {
    files         : object.isRequired,
    storeFile     : func.isRequired,
    makeTransunits: func.isRequired,
    downloadFile  : func.isRequired,
  },

  componentWillReceiveProps(nextProps) {
    const { makeTransunits } = this.props

    if (filesChanged(this.props.files, nextProps.files)) {
      makeTransunits(nextProps.files)
    }
  },

  fileChanged(evt, name) {
    const files = evt.target.files
    const { storeFile } = this.props
    if (!files.length) return
    storeFileContent(name, files[0], storeFile)
  },

  _resetFile(name) {
    const { resetFile } = this.props

    if (isDirty(name)) {
      if (confirm("Close and loose your changes ?")) {
        resetFile(name)
      } else {
        return
      }
    } else {
      resetFile(name)
    }
  },

  render() {
    return (
      <div className="flex-row">
        {
          fileMod.FILE_DESC.map( d => this.renderFile(d) )
        }
      </div>
    );
  },

  renderFile(desc) {
    const { name, label } = desc
    const { files } = this.props
    const file = files[name]

    return (
      <div key={name} className="flex-1 file-loader">
        <h4>{label}</h4>
        <div className="panel">
          {
            (file && file.name) ? this._renderFileDesc(file, name) : this._renderFileInput(name, desc.help)
          }
        </div>
      </div>
    )

  },

  _renderFileInput(name, helpText) {
    return (
      <div>
        <div className="alert alert-info">{helpText}</div>
        <input type="file" accept=".json" onChange={ (e) => this.fileChanged(e, name) } />
      </div>
    )
  },

  _renderFileDesc(file, name) {
    const { downloadFile } = this.props
    const { name: filename, size, lastModified } = file
    const updatedAt = new Date(lastModified)

    return (
      <div className="file-desc">
        <div className="flex-row">
          <label className="flex-1">File</label>
          <div className="flex-3">
            { (name == 'catalog') && this._renderFlag(filename) }
            {filename}
          </div>
        </div>
        <div className="flex-row">
          <label className="flex-1">Size</label>
          <div className="flex-3">{size} bytes</div>
        </div>
        <div className="flex-row">
          <label className="flex-1">Updated</label>
          <div className="flex-3">{updatedAt.toLocaleString()}</div>
        </div>
        <div className="text-right">
          {
            (name != 'defaultMsg') &&
            <a className="btn btn-primary" onClick={ () => downloadFile(name) }>
              <i className="fa fa-fw fa-download"/>
              Download
            </a>
          }
          <a className="btn" onClick={ () => this._resetFile(name) }>
            <i className="fa fa-fw fa-undo"/>
            Cancel
          </a>
        </div>
      </div>
    )
  },

  _renderFlag(filename) {
    const { 0: cult } = filename.split('.')
    const { 0: lang } = (cult.length > 3) ? cult.split('-') : [cult]

    return (
      <span className="flag">
        <img src={`./images/flags/${lang}.svg`}/>
      </span>
    )
  }
})


/*
  Container
 */

 function stateToProps(state) {
   return {
     files: fileMod.getFiles(state)
   };
 }

 function dispatchToProps(dispatch) {
   return {
     storeFile(name, file, data) {
       dispatch(fileMod.storeFile(name, file, data))
       setDirty(name, false)
     },
     resetFile(name) {
       dispatch(fileMod.resetFile(name))
       setDirty(name, false)
     },
     makeTransunits(files) {
       dispatch(tuMod.makeEntities(files))
     }
   }
 }

 export default connect(stateToProps, dispatchToProps)(Files);
