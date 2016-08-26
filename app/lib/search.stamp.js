/**
 * 	SearchStamp
 * 		utilisé en association avec connectSearch, d'intégrer les valeurs des champs d'un formulaire reduxForm
 * 		automatiquement dans le state (state.search[FORM_NAME])
 *
 * 		ces valeurs sont ensuite récupérées dans la gestion de la liste pour l'exécution des filtres
 *
 *
 *  ## Composition
 *  	runFilter - exécutée automatiquement en sur le changement du state (state.search[FORM_NAME])
 *  							peut être exécuté manuellement? pas fait pour - à voir
 *    preventSubmit - à intégrer sur le form
 *
 *  ## Usage
 *
  		// search.cont
      import React from 'react'
      import reactStamp from 'react-stamp'
      import SearchStamp from 'stamps/search.stamp'


      export default  reactStamp(React).compose(
        SearchStamp,
      {
        displayName: 'XXXX.Search.Component',

        propTypes: {
          fields: object.isRequired,
        },

        render: function() {
          const { fields: { filter } } = this.props
          return (
            <Form
              onSubmit={this.preventSubmit}
            >
            ...
            </Form>
          )
        }
      })
 *
 */
import R from 'ramda'
import React from 'react'
import debounce from 'lodash.debounce'

// const mapVals = R.map(R.prop('value'))

function mapVals(fields) {
  return R.map(f => {
    if (Array.isArray(f)) return mapVals(f)
    if (R.has('value', f)) return R.prop('value', f)
    return mapVals(f)
  }, fields)
}

const {
  func
} = React.PropTypes


const SearchBase = {
  displayName: 'SearchBase.Stamp',

  propTypes: {
    onFilter: func.isRequired,
  },

  init() {
    // @see http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/28046731#28046731
    // debounce allows to be not to much reactive on user typing
    // leading true allows to be reactive on click on element
    this.runFilter = debounce(this.props.onFilter, 300, { leading : true })

    //bind preventSubmit to avoid user error
    this.preventSubmit = this.preventSubmit.bind(this)
  },

  // use redux form flux to handle criteria change
  componentWillReceiveProps(nextProps) {
    const nextValues = mapVals(nextProps.fields)
    // run filter only if diff values
    if (!R.equals(nextValues, mapVals(this.props.fields))) {
      this.runFilter(nextValues)
    }
  },

  /**
   * use preventSubmit on onSubmit Form
   * 		render() {
   * 			return (
   * 				<form onSubmit={this.preventSubmit} >
   * 					...
   * 				</form>
   * 			)
   * 		}
   *
   * @param  {Event} e
   * @return {[type]}   [description]
   */
  preventSubmit(e) {
    e && e.preventDefault()
    this.runFilter(mapVals(this.props.fields))
  }
}

export default SearchBase
