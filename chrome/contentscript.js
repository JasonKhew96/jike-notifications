function init () {
  console.log('Jike Init')
  chrome.runtime.sendMessage({
    token: window.localStorage['auth-token']
  })
}

window.addEventListener('load', init)
