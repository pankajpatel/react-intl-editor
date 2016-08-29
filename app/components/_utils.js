/* globals document */
import R from 'ramda'
import { setDirty } from 'lib/dirty'

/**
 * Trims and cleans multiline messages
 */
export function cleanMessage(str) {
  return R.pipe(
    R.split("\n"),
    R.map(R.trim),
    R.join("\n")
  )(str)
}

export function makeFile(filename, transunits) {
  var data = R.pipe(
    R.values,
    R.map( tu => ([ tu.id, cleanMessage(tu.message) ])),
    R.fromPairs
  )(transunits)

  var text = JSON.stringify(data, null, "\t")
  var elem = document.createElement('a')
  elem.setAttribute('href', 'data:application/jsoncharset=utf-8,' + encodeURI(text))
  elem.setAttribute('download', filename)
  elem.click()
  elem.remove()

  setDirty(false)
}
