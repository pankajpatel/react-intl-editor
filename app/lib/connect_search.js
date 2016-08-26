/**
 * 	connectSearch
 * 		connectSearch permet de dupliquer (ou modifier) les valeurs d'un reduxForm sur le state `search.FORM_NAME`
 *
 * 		La duplication est obligatoire pour prender le contrôle de l'exécution
 * 		de la recherche et éviter de récupérer tous les évènements reduxForm (onBlur, onFocus...)
 *
 *  	Ce connecteur permet de simplifier l'écriture des formulaires de recherche utilisant redux-form
 *  	il ajoute une fonction de dispatch `setFilter` au composant connecté
 *
 * 		cette fonction appelle le reducer `redux/modules/search.mod` qui inscrit les valeurs passées à la fonction
 *
 * 		  // composant
 * 			setFilter({myField: 'my value'}) => state.seacrh[FORM_NAME] = {myField: 'my value'}
 * 			// FORM_NAME  est le nom du formulaire récupéré de options de configuration de reduxForm
 *
 *	Le composant doit utiliser le stamp `SearchStamp` pour un meilleur contrôle du `setFilter` et du `preventSubmit`
 *
 *  ## Options
 *    - reduxFormConfig (object) - REQUIRED
 *    		correspond à la configuration du connecteur reduxForm
 *    		voir http://redux-form.com/5.2.5/#/api/reduxForm
 *    - stateToProps (func)
 *    - dispatchToProps (func)
 *
 *  ## Returns
 *  	fonction de composition reduxForm
 *
 *  ## Usage
 *
  		// search.cont
  		import connectSearch from "lib/connect_search"
      import SearchForm from './search.comp.jsx'

      const FORM_NAME = 'moduleSearchForm'
      const fields = ['filter', 'type', 'mine', 'archived']

      function stateToProps(state) {
        return {
          moduleTypes: getMetaRefs('module.type'),
          meId: meMod.getAccount(state)._id,
          initialValues: {
            mine: false,
            archived: false,
          }
        }
      }


      export default connectSearch(
        {
          form: FORM_NAME,
          fields: fields
        },
        stateToProps
       )(SearchForm)

 *
 */

import R from 'ramda'
import { reduxForm } from 'redux-form'
import { setFilter } from 'redux/modules/search.mod'

export default function connectSearch(reduxFormConfig, stateToProps, dispatchToProps) {
  const { form } = reduxFormConfig
  if (!R.has('destroyOnUnmount', reduxFormConfig)) reduxFormConfig.destroyOnUnmount = false

  return reduxForm(reduxFormConfig,
    stateToProps,
    (dispatch) => (
      R.merge(
        typeof dispatchToProps == 'function' ? dispatchToProps(dispatch) : {},
        {
          onFilter(filter) {
            dispatch(setFilter( form, filter ))
          }
        }
      )
    )
  )
}
