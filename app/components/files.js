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

const Files = reactStamp(React).compose({

  propTypes: {
    files         : object.isRequired,
    storeFile     : func.isRequired,
    makeTransunits: func.isRequired,
  },

  componentWillReceiveProps(nextProps) {
    const { files: { defaultMsg , catalog } } = this.props
    const { files: { defaultMsg: defaultMsgNext , catalog: catalogNext } } = nextProps
    const { makeTransunits } = this.props

    if ( !R.equals(R.path(['name'], defaultMsg), R.path(['name'], defaultMsgNext)) ||
         !R.equals(R.path(['name'], catalog), R.path(['name'], catalogNext)) ) {
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
    if (isDirty()) {
      if (!confirm("Close and loose every changes done ?")) return
    }
    resetFile(name)
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
    const { name: filename, size, lastModified } = file
    const updatedAt = new Date(lastModified)

    return (
      <div className="file-desc">
        <div className="flex-row">
          <label className="flex-1">File</label>
          <div className="flex-3">{filename}</div>
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
          <a className="btn" onClick={ () => this._resetFile(name) }>
            <i className="fa fa-fw fa-undo"/>
            Cancel
          </a>
        </div>
      </div>
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
       setDirty(false)
     },
     resetFile(name) {
       dispatch(fileMod.resetFile(name))
       setDirty(false)
     },
     makeTransunits(files) {
       dispatch(tuMod.makeEntities(files))
     }
   }
 }

 export default connect(stateToProps, dispatchToProps)(Files);
