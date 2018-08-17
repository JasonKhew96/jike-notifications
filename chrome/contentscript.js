function init () {
  console.log('Jike Init')
  chrome.runtime.sendMessage({
    type: 'token',
    accessToken: window.localStorage['access-token'],
    authToken: window.localStorage['auth-token']
  })
}

window.addEventListener('load', init)
