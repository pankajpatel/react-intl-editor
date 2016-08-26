import { remote } from 'electron'

export function setDirty(v) {
  remote.getGlobal('sharedObj').dirty = v;
}

export function isDirty() {
  return remote.getGlobal('sharedObj').dirty === true
}
