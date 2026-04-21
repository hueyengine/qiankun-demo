const preHijackNodes = new WeakSet()
Array.from(document.head.childNodes).forEach((n) => preHijackNodes.add(n))

const ownedNodes = []
let observer = null
let initialized = false

function isOwnedStyleNode(node) {
  if (!node || node.nodeType !== 1) return false
  if (preHijackNodes.has(node)) return false
  if (node.tagName === 'STYLE') return node.hasAttribute('data-vite-dev-id')
  if (node.tagName === 'LINK' && node.rel === 'stylesheet') return true
  return false
}

export function hijackStyles(container) {
  if (!container) return

  if (!initialized) {
    Array.from(
      document.head.querySelectorAll('style, link[rel="stylesheet"]')
    ).forEach((node) => {
      if (!isOwnedStyleNode(node)) return
      ownedNodes.push(node)
      container.appendChild(node)
    })
    initialized = true
  } else {
    ownedNodes.forEach((node) => {
      if (node.parentNode !== container) container.appendChild(node)
    })
  }

  observer?.disconnect()
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (!isOwnedStyleNode(node)) return
        if (node.parentNode === container) return
        if (!ownedNodes.includes(node)) ownedNodes.push(node)
        container.appendChild(node)
      })
    }
  })
  observer.observe(document.head, { childList: true })
}

export function releaseStyles() {
  observer?.disconnect()
  observer = null
}
