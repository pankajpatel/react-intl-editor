import R from 'ramda'
import { remote } from 'electron'

/**
 * Sets dirty value for a file
 */
export function setDirty(name, v) {
  remote.getGlobal('dirty')[name] = v;
}

/**
 * Returns true if any of the editable file is dirty
 * If no name provided, checks all files
 *
 * @param name {String}  - optional file name (defaultMsg|catalog|whitelist)
 *
 */
export function isDirty(name = null) {
  const dirty = remote.getGlobal('dirty')

  if (name) {
    return R.has(name, dirty) && R.prop(name, dirty)

  } else {
    return R.pipe(
      R.values,
      R.any(R.identity)
    )(dirty)
  }
}
