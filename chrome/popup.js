let names = document.getElementById('names')
let save = document.getElementById('save')

save.onclick = function (element) {
  let nameList = names.value
  chrome.runtime.sendMessage({
    nameList: nameList
  })
}

window.addEventListener('load', function () {
  chrome.runtime.sendMessage({
    command: 'getNameList'
  }, function (resp) {
    names.value = resp.nameList
  })
})
