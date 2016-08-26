/**
 * searchList
 * ## buildFilter
 * 		contruit un filtre de liste dont les critères sont pris en compte en fonction
 * 		d'une fonction de vérification de critère (predicate)
 *
 * buildFilter est un constructeur qui renvoi un objet avec 2 méthodes principales
 *
 * 	*	addFilter
 * 	* filter|filterCache
 *
 * ### addFilter
 * permet de construire les filtres à appliquer sur la liste
 *
 *
 * 	addFilter(applyPredicate, makeRowFilter)
 *  	- applyPredicate est une fonction qui prend en entré les critères du filtre et renvoie
 *  			* true pour que `filter` soit appliqué
 *  			* false pour que `filter` soit ignoré
 *
 *  	- makeRowFilter est une fonction qui prend en entré les critères et qui retoure un predicat qui prendra
 *  		 une `row` de la liste à filtrer et renverra true ou false
 *
 * 	 const searchList = buildFilter()
 *   .addFilter(
 *   	function applyPredicate(criterias) {
 *   		return criterias.paramName // paramName exists et est truthy => filter sera appliqué
 *   	},
 *   	function makeRowFilter(criterias) {
 *   		return function(row) {
 *   			return row.paramName === criterias.paramName
 *   		}
 *   	}
 *   )
 *
 * 	 // même chose avec es6 et ramda
 *   addFilter(
 *   	(c) => R.prop('paramName', c),
 *   	(c) => R.propEq('paramName', R.prop('paramName', c))
 *   )
 *
 * ### filter | filterCache
 * 	exécute les filtres sur une liste en fonction des critères
 *  filterCache met en cache le précédent résultat et si la référence de la liste n'a pas changé
 *  et que les valeurs des critères n'ont pas changé => renvoie la dernière liste filtrée
 *
 * 		const searchList = buildFilter()
 * 						.addFilter(
 * 							c => R.prop('paramName'),
 * 							c => R.propEq('paramName', R.prop('paramName', c))
 * 						)
 *
 *   	const list = [{a: 'a', paramName: 'bb'}  {a: 'b', paramName: 'abc'}]
 * 	 	const filteredList = searchList.filter(list, { paramName: 'abc' })
 *    // filteredList = [{a: 'b', paramName: 'abc'}]
 *
 * 	 	const filteredList = searchList.filter(list, { paramName: false })
 * 	 	// filteredList === list
 *
 * ## Usage


    import { buildFilter } from 'lib/search_list'
    import List from './list.comp.jsx'

    const searchList = buildFilter()
     .addFilterOnCols({
       critPath: ['filter'],
       cols: ['name']
     })
     .addPropEqFilter('type')
     .addFilter(
       crits => crits.mine,
       (crits) => R.propEq('owner', crits.mine)
     )
     .addFilter(
       crits => crits.archived,
       () => R.propEq('status', 'mod.st.arch')
     )

    function stateToProps(state, ownProps) {
     const { organizationId } = ownProps
     const {
       list
     } = modMod.getListByOrga(state, organizationId)

     const {
       crits
     } = state.search


     return {
       organizationId,
       list: searchList.filterCache(list, crits)
     }
    }

    export default connect(stateToProps)(List)

 *
 */
import R from 'ramda'
import stampit from 'stampit'
import { removeDiacritics } from './str.lib'
// import VError from 'verror'


export function makeFilterOnCols(cols, filter) {
  const colLength = cols.length
  return function subMatchFilterOnCols(row) {
    var filterColumn, colval
    for (let j = 0; j < colLength; j++) {
      filterColumn = cols[j]
      colval = row[filterColumn]
      colval = typeof colval !== 'undefined' && removeDiacritics(colval.toLowerCase())
      if (colval !== false && colval.indexOf(filter) > -1) {
        return true
      }
    }
    return false
  }
}



export const buildFilter = stampit()
.static({
  stamps: {},
  get(name) {
   if (!this.stamps[name]) this.stamps[name] = this()
   return this.stamps[name]
}
})
.props({
  filters: [],
  prevCrits: undefined,
  prevList: undefined,
  prevResult: undefined
})
.methods({
  /**
   * add filter that is built with `makeFilter`
   * filter is applied only if applyIf(criteria) is true
   *
   * criteria is never null or undefined
   *
   * @param {Function} applyIf - predicate that indicate whether to apply filter returned by makeFilter
   * @param {Function} makeFilter
   *
   * @sig applyIf : (criterias) => Boolean
   * @sig makeFilter: (criterias) => Function(row) => Boolean
   *    // es5
   * 		buildFilter()
   * 			.addFilter(
   * 			  // apply if prop a exist in crits and crits.a is truthy
   * 				function(crits) {
   * 					return crits && crits.a
   * 				},
   * 				function(crits) {
   * 					return function(row) {
   * 						return row.a === crits.a
   * 					}
   * 				}
   * 			)
   *
   *    // same using es6 & ramda
   * 		buildFilter()
   * 			.addFilter(
   * 				(c) => R.prop('a', c) // apply if prop a exist in c and c.a is truthy
   * 				(c) => R.propEq('a', c.a) // here c.a exists - apply criteria list[n].a === c.a
   * 			)
   */
  addFilter(applyIf, makeFilter) {
    this.filters.push({
      applyIf,
      makeFilter
    })
    return this
  },

  /**
   * apply criteria list[n][prop] === criteria[a] if criteria[a] is truthy
   * @param {String} prop
   */
  addPropEqFilter(prop) {
    return this.addFilter(
      c => !!R.prop(prop, c),
      c => R.propEq(prop, R.prop(prop, c))
    )
  },

  addPropInFilter(prop) {
    return this.addFilter(
      c => R.prop(prop, c),
      c => (row) => R.contains(row[prop], c[prop])
    )
  },

  /**
   * "Field(s) value contains search term"
   * build a filter that search R.path(critPath, criterias) on list[...cols]
   * search removeDiacritics and lower case values of cols and criterias[critPath]
   *
   * @param {Object} p
   * @param {Array} p.critPath
   * @param {Array} p.cols
   *
   * 		buildFilter()
   * 			.addFilterOnCols({
   * 				critPath: ['filter', 'a'] // => criterias['filter']['a'] has X value it will run filter on cols with X
   *     		cols: ['name', 'status', 'email']
   * 			})
   *
   */
  addFilterOnCols({critPath, cols}) {
    return this.addFilter(
      c => !!R.path(critPath, c),
      c => {
        let v = R.path(critPath, c)
        if (v && v.toLowerCase) v = v.toLowerCase()
        return makeFilterOnCols(cols, removeDiacritics(v))
      }
    )
  },

  /**
   * build predicate from added filters and criterias received
   *
   * @private
   *
   * @param  {Object|null} crits
   * @return {Function} predicate built based on filters and criterias that take a row and return Boolean
   */
  getFilterPredicate(crits) {
    if (R.isEmpty(this.filters)) return R.identity

    let pos, applyOk, errors = [], error

    var filters = R.reduce((accu, filter) => {
      try {
        pos = 0
        applyOk = filter.applyIf(crits)
        pos = 1
        if (applyOk) accu.push(filter.makeFilter(crits))
      } catch(e) {
        // error = new VError(e, pos === 0 ? 'error in filter predicate' : 'error in filter makeFilter')
        errors.push(error)
      }
      return accu
    }, [], this.filters)

    if (errors.length) {
      throw new Error(errors.join(', '))
      // throw new VError.MultiError(errors)
    }

    if (filters.length) return R.allPass(filters)
    return R.identity
  },

  /**
   * filter a list based on filters and criterias
   *
   * @param  {Array} list
   * @param  {Object|String|null} crits
   * @return {Array} filtered array or identical list
   */
  filter(list, crits) {
    if (!Array.isArray(list)) {
      throw new Error('list must be an array')
    }

    // enforce crits as object if not the case
    const pCrits = R.isNil(crits) ? {} : crits
    const nextList = R.filter(this.getFilterPredicate(pCrits), list)
    return nextList.length === list.length ? list : nextList
  },

  /**
   * same as filter but with caching capabilities
   * if reference of list is equal to prevList and
   * if values of criterias are equal to prevCrits
   *   it return previous list (if previous list exists)
   *
   * @param  {Array} list
   * @param  {Object|String|null} crits
   * @return {Array} filtered array or identical list
   */
  filterCache(list, crits) {
    if ((list !== this.prevList) ||
        !R.equals(crits, this.prevCrits) ||
        R.isNil(this.prevResult) ) {
      this.prevList = list
      this.prevCrits = crits
      this.prevResult = this.filter(list, crits)
    }
    return this.prevResult
  }
})
