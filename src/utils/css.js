export function getCssVar(varName, element = document.documentElement) {
  if (!varName?.startsWith("--")) {
    return ""
  }
  // 没有拿到值时，会返回空串
  return getComputedStyle(element).getPropertyValue(varName)
}

export function setCssVar(varName, value, element = document.documentElement) {
  if (!varName?.startsWith("--")) {
    return
  }
  element.style.setProperty(varName, value)
}
