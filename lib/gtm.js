export function track(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...payload,
  })
}
