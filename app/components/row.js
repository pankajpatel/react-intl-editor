import React from 'react'
import reactStamp from 'react-stamp'
import cn from 'classnames'

const { func, string } = React.PropTypes

export const Header = () => (
  <div className="list-header transunit">
    <div className="list-cell flex-2">
      <span className="form-control-static">
        Description
      </span>
    </div>
    <div className="list-cell flex-2">
      <span className="form-control-static">
        Source
      </span>
    </div>
    <div className="list-cell flex-content">
      <i className="fa fa-arrow-right form-control-static text-muted"/>
    </div>
    <div className="list-cell flex-3">
      <span className="form-control-static">
        Translation
      </span>
    </div>
  </div>
)

export const Row = reactStamp(React).compose({

  propTypes: {
    id            : string.isRequired,
    defaultMessage: string.isRequired,
    message       : string.isRequired,
    description   : string.isRequired,
    updateMessage : func.isRequired,
  },

  state: {
    message: null
  },

  init() {
    this._onBlur      = this._onBlur.bind(this)
    this._onChange    = this._onChange.bind(this)
    this._copyDefault = this._copyDefault.bind(this)

    this.state.message = this.props.message
  },

  _onChange(evt) {
    const { target: { value } } = evt
    this.setState({ message: value })
  },

  _onBlur(evt) {
    const { id, updateMessage } = this.props
    const { target: { value } } = evt
    updateMessage({ id, message: value })
  },

  _copyDefault() {
    const { id, defaultMessage, updateMessage } = this.props
    this.setState({ message: defaultMessage })
    updateMessage({ id, message: defaultMessage })
  },

  render() {
    const {
      id, defaultMessage, description, translated
    } = this.props
    const { message } = this.state

    const cls = cn("list-row transunit", {
      'has-success':  translated,
      'has-error':   !translated,
    })

    return (
      <div className={cls}>
        <div className="list-cell flex-2">
        <div className="form-control-static">
          <div className="smaller text-muted">
            {id}
          </div>
          <div className="small">
            {description}
          </div>
        </div>
        </div>
        <div className="list-cell flex-2">
          <span className="form-control-static">
            {defaultMessage}
          </span>
        </div>
        <div className="list-cell flex-content">
          <a onClick={ this._copyDefault }>
            <i className="fa fa-arrow-right form-control-static"/>
          </a>
        </div>
        <div className="list-cell flex-3">
          <textarea
            type="text"
            value={message}
            onChange={ this._onChange }
            onBlur={ this._onBlur }
            className="form-control"
            />
        </div>
      </div>
    )
  }

})
