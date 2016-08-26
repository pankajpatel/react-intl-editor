/**
 * 	FORM
 *  	default form presentation
 *
 *  ## Options
 *
 *    - onSubmit  (func)    - REQUIRED handle submit - just a notification to handle submit
 *    - className (func)    - add class to form
 *
 *  ## Usage
 *
 *		import Form from "components/form.comp"
 *
 * 		...
 * 			render() {
 * 				return (
 * 					<Form onSubmit={() => console.log('onSubmit is just a notif ...')}>
 *      			<input type="text" />
 * 					</Form>
 * 				)
 * 			}
 * 		...
 *
 *  ## Available widgets
 *    - Form                    - Simple form wrapper
 *    - FormGroup               - Container with label, input & help|error message
 *    - Input       [        ]
 *    - Checkbox    [x]
 *    - Textarea    [        ]
 *    - Select      [...    v]  - simple select
 *    - RSelect     [...    v]  - react select
 *    - InputGroup  [x][     ]  - input + addon
 *    - Switch      -()         - (on|off) switch
 *
 *
 *
 * 	@todo :
 * 	FORMGROUP
 * 	INPUT
 * 	INPUTGROUP
 * 	SELECT
 * 	RSELECT
 * 	FIELDHELP
 * 	FIELDERROR
 */

import R from 'ramda'
import React from 'react'
import reactStamp from 'react-stamp'
import cn from 'classnames'

const isString = R.is(String)

const {
  func, string, object, shape, bool, number, oneOfType, node, array
} = React.PropTypes

const isValueSet = (v) => {
  return (
    (v !== undefined) &&
    (
      R.is(Boolean, v) ||
      R.is(Number, v) ||
      (R.is(Object, v) && R.length(R.values(v))) ||
      (v && v.toString && v.toString().length)
    )
  )
}

const Form = reactStamp(React).compose({
  displayName: 'SimpleFormWrapper',

  propTypes: {
    className: string,
    onSubmit: func
  },

  defaultProps: {
    className: ''
  },


  render() {
    const {
      className = "",
      ...otherProps
    } = this.props

    return (
      <form
        className={'form-horizontal ' + className}
        {...otherProps}
        role="form">
      <div className="form-content">
        {this.props.children}
      </div>
      </form>
    )
  }
})



export const FormGroup = reactStamp(React).compose({

  displayName: "FormGroup",

  propTypes: {
    label: oneOfType([string, bool, node]),
    showLabel: bool,
    on: bool,
    field: shape({
      active  : bool,
      value   : oneOfType([string, number, bool, array]),
      name    : string.isRequired,
      touched : bool,
      help    : string,
      // if object it must me a locale {id, defaultMessage}
      error   : oneOfType([string, object])
    }).isRequired
  },

  defaultProps: {
    showLabel: true
  },

  render() {
    const {
      label, showLabel, field, children, className, help, on
    } = this.props

    const showError = field.touched && field.error
    const classes = cx('form-group', className, {
      'on'         : field.active || isValueSet(field.value) || on,
      'active'     : field.active,
      'has-danger' : showError
    })


    return (
      <div className={classes}>
        {
          (showLabel && (label !== false)) &&
          <label className="form-control-label" htmlFor={field.name}>
            {label}
          </label>
        }
        { children }
        {
          showError && <FieldError error={field.error} />
        }
        {
          (help && !showError) && <FieldHelp msg={help} />
        }
      </div>
    )
  }
})

export const Input = reactStamp(React).compose({

  displayName: "Form.Input",

  render() {
    const { field, type="text", className="", ...rest } = this.props
    let isCheckOrRadio = R.indexOf(type, ['checkbox', 'radio']) >= 0

    return (
      <input id={field.name}
        type={type}
        className={ cn({ "form-control": !isCheckOrRadio }, className) }
        {...field}
        {...rest}
        />
    )
  }
})

/**
 * Beware !
 * Checkbox requires label to be set on Checkbox element, not on FormGroup !!!
 */
export function Checkbox({ field, type="checkbox", className="", label="", ...rest }) {
  return (
    <div className="checkbox">
      <label>
        <Input
          type={type}
          field={field}
          {...rest}
          />
        <span className="form-control-label">{label}</span>
      </label>
    </div>
  )
}

export function Textarea({ field, className="", ...rest }) {
  return (
    <textarea
      id={field.name}
      className={ cn("form-control", className) }
      {...field}
      {...rest}
    >
    </textarea>
  )
}

export function Select({field, options}) {
  // <option value=""></option>
  return (
    <select
      className="form-control c-select"
      {...field}>
    {
      options.map((item, key) => (
        <option key={key} value={item.value}>{item.label}</option>
      ))
    }
    </select>
  )
}

export function RSelect({field, options, ...rest}) {
  const { value, onBlur } = field
  //@see https://github.com/erikras/redux-form/issues/82
  //     https://github.com/athill/wimf/commit/f346fa2b5e478bfc295e61708c8e3fd7b72e098f
  // className="form-control" // Removed as it's styles specificaly in _form.scss

  return (
    <ReactSelect
        placeholder=''
        {...field}
        {...rest}
        value={value || ''}
        options={options}
        onBlur={() => onBlur && onBlur(value)}
    />
  )
}

export function RSelectAsync({field, loadOptions, ...rest}) {
  const { value, onBlur } = field
  //@see https://github.com/erikras/redux-form/issues/82
  //     https://github.com/athill/wimf/commit/f346fa2b5e478bfc295e61708c8e3fd7b72e098f
  // className="form-control" // Removed as it's styles specificaly in _form.scss

  return (
    <ReactSelect.Async
        placeholder=''
        {...field}
        {...rest}
        value={value || ''}
        loadOptions={loadOptions}
        onBlur={() => onBlur && onBlur(value)}
    />
  )
}




export function InputGroup({ field, children, position = "after", className, ...rest }) {
  return (
    <div className={cn("input-group", className)}>
      {
        position == "before" &&
        <div className="input-group-addon">
          {children}
        </div>
      }
      <Input field={field} {...rest}/>
      {
        position == "after" &&
        <div className="input-group-addon">
          {children}
        </div>
      }
    </div>
  )
}

/**
 * [Switch description]
 * @param {Object}                    - The form field
 * @param {[Bool]}    on=true         - Value when activated
 * @param {[Bool]}    off=false       - Value when NOT activated
 * @param {[Bool]}   disabled=false   -
 * @param {[String]} className        - Add this class permanently
 * @param {[String]} activeClassName  - Add this class when activated only
 */
export function Switch({ field, on=true, off=false, disabled=false, className, activeClassName, ...rest }) {
  const active = field.value == on
  return (
    <SwitchBase
      active={active}
      className={className}
      activeClassName={activeClassName}
      disabled={disabled}
      onClick={(active) => field.onChange(active ? on : off)}
      {...rest}
    />
  )
}


export function SwitchBase({ active, onClick, disabled=false, className, activeClassName, ...rest }) {
  const cls    = cn("btn-switch form-control-static", className, {
    active, disabled,
    [activeClassName]: active
  })

  return (
    <div
      className={cls}
      onClick={ () => onClick(!active) }
    />
  )
}


export function FieldHelp({msg}) {
  return (
    <div className="text-help col-sm-right">
      {msg}
    </div>
  )
}


export function FieldError({error}) {
  return (
    <div className="text-help error-msg">
      {
        isString(error) ?
        error :
        <FormattedMessage {...error} />
      }
    </div>
  )
}

export default Form
