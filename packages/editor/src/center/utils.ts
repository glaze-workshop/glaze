import path from 'path'

/**
 * <root>/componentName
 */
export const isComponentDir = (root: string, target: string): boolean => {
  const relative = path.relative(root, target)
  return !!relative && !relative.includes(path.sep) && path.extname(target) === ''
}

/**
 * return componentsName
 */
export const belongsTo = (root: string, target: string): string | false => {
  const relative = path.relative(root, target)
  if (relative.startsWith('..')) {
    return false
  }

  return relative.split(path.sep)[0]
}
