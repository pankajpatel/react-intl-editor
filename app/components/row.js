import R from 'ramda'
import React from 'react'
import reactStamp from 'react-stamp'
import cn from 'classnames'

import { cleanMessage } from './_utils'

const { func, string, bool } = React.PropTypes

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
    showWhitelist : bool,
  },

  state: {
    message: null,
    whitelisted: null
  },

  init() {
    this._onBlur      = this._onBlur.bind(this)
    this._onChange    = this._onChange.bind(this)
    this._copyDefault = this._copyDefault.bind(this)
    this._toggleWhite = this._toggleWhite.bind(this)

    this.state.message     = cleanMessage(this.props.message)
    this.state.whitelisted = this.props.whitelisted
  },

  componentWillReceiveProps(nextProps) {
    const updState = ['whitelisted']

    // Reset state when whitelist is resetted => force update
    updState.forEach( n => {
      if (R.equals(R.prop(n, nextProps), R.prop(n, this.props)) ) return
      this.setState({ [n]: R.prop(n, nextProps)})
    })
  },

  _updateMessage(message, whitelisted) {
    const {
      id,
      updateMessage
    } = this.props
    const clean = cleanMessage(message)

    updateMessage({
      id,
      message: clean,
      whitelisted: whitelisted === undefined ? this.state.whitelisted : whitelisted
    })
  },

  _onChange(evt) {
    const { target: { value } } = evt
    this.setState({ message: value })
  },

  _onBlur(evt) {
    const { target: { value } } = evt
    this._updateMessage(value)
  },

  _copyDefault() {
    const { defaultMessage } = this.props
    this.setState({ message: defaultMessage })
    this._updateMessage(defaultMessage)
  },

  _toggleWhite() {
    const { whitelisted, message } = this.state
    const { defaultMessage } = this.props
    const newValue = !whitelisted
    const newMessage = newValue ? defaultMessage : message
    this.setState({ whitelisted: newValue, message: newMessage })
    this._updateMessage(newMessage, newValue)
  },

  render() {
    const {
      id, description, translated
    } = this.props
    const { message, whitelisted } = this.state

    const cls = cn("list-row transunit", {
      'has-success':  translated,
      'has-error':   !translated,
      'whitelisted':  whitelisted,
    })

    return (
      <div className={cls}>
        <div className="list-cell flex-2">
        <div className="form-control-static text-muted">
          <div className="smaller">
            {id}
          </div>
          <div className="small">
            {description}
          </div>
        </div>
        </div>
        <div className="list-cell flex-2">
          { this.renderSource() }
        </div>
        <div className="list-cell flex-content flex-column text-center">
          <div className="flex-column">
              <a className="flex-1" onClick={ this._copyDefault } style={{ alignSelf: 'center' }}>
                <i className="fa fa-arrow-right form-control-static"/>
              </a>
            <div className="flex-content">
              { this.renderWhitelisted() }
            </div>
          </div>
        </div>
        <div className="list-cell flex-3">
          <textarea
            type="text"
            disabled={whitelisted}
            value={message}
            onChange={ this._onChange }
            onBlur={ this._onBlur }
            className="form-control"
            />
        </div>
      </div>
    )
  },

  renderSource() {
    const { defaultMessage } = this.props

    return (
      <span className="form-control-static default-msg" dangerouslySetInnerHTML={{ __html: defaultMessage.replace("\n", '<br/>') }}/>
    )
  },

  renderWhitelisted() {
    const { whitelisted, showWhitelist } = this.props
    if (!showWhitelist) return

    const cls = cn('tag', {
      'tag-success':  whitelisted,
      'tag-stroke':  !whitelisted,
    })
    const icn = cn('fa fa-fw', {
      'fa-check':     whitelisted,
      'fa-square-o': !whitelisted,
    })

    return (
      <a className={cls} onClick={ this._toggleWhite }>
        <i className={icn}/>
        Whitelist
      </a>
    )
  }

})
