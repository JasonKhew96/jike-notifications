const jikeLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDAgNDAiPjxkZWZzPjxyZWN0IGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIvPjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjkwLjM3NCUiIHgyPSI3OC42MDQlIiB5MT0iNjguMTk4JSIgeTI9IjY4LjE5OCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RUMxRjkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1RUI4RjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjx1c2UgZmlsbD0iI0ZGRTQxMSIgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNLjk4OSAyMC44M2EuNTIuNTIgMCAwIDEtLjA1NC4wMWwxLjcyIDEuNjc3YzEuNjU0LS4xNTIgMy4yNzMtLjU4NyA0LjQ2NS0xLjAxOCAxLjE5My0uNDMyIDIuMTc0LS45ODcgMi45NDUtMS42NjdhNi4yMjcgNi4yMjcgMCAwIDAgMS43MTMtMi40NWMuMzctLjk1NC41NTUtMi4wNTUuNTU1LTMuMzAzVjcuOTE1YzAtMS4zOS4wMDUtMi41OTUuMDE1LTMuNjE0LjAxLTEuMDIuMDE2LTEuOTQuMDE2LTIuNzYzTDEwLjQ0LjAwM2MwIC44MjEtLjAwNSAxLjc0MS0uMDE1IDIuNzYtLjAxIDEuMDE5LS4wMTUgMi4yMjQtLjAxNSAzLjYxNHY2LjE2NGMwIDEuMjQ4LS4xODUgMi4zNDktLjU1NSAzLjMwMmE2LjIyNyA2LjIyNyAwIDAgMS0xLjcxMyAyLjQ1Yy0uNzcuNjgtMS43NTIgMS4yMzYtMi45NDUgMS42NjctMS4xNzcuNDI2LTIuNTguNzE2LTQuMjA4Ljg3eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuOTQ5IDkuMzU5KSIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMy4zOSA5LjM1OWMwIC44MjItLjAwNiAxLjc0My0uMDE2IDIuNzYyLS4wMSAxLjAyLS4wMTUgMi4yMjUtLjAxNSAzLjYxNVYyMS45YzAgMS4yNDgtLjE4NSAyLjM0OS0uNTU2IDMuMzAyYTYuMjI3IDYuMjI3IDAgMCAxLTEuNzEyIDIuNDVjLS43NzEuNjgtMS43NTMgMS4yMzYtMi45NDUgMS42NjctMS4xOTIuNDMxLTIuNjE1LjcyMy00LjI2OS44NzVsLS45MjgtMy45ODdhMTYuNzIgMTYuNzIgMCAwIDAgMi4yMzctLjQwNCA0LjY2IDQuNjYgMCAwIDAgMS42NzQtLjc5OWMuNTA3LS4zOTUuODktLjg5MiAxLjE1LTEuNDkxLjI1OC0uNTk5LjM4Ny0xLjM5LjM4Ny0yLjM3NCAwLS43OTIuMDAzLTEuNjI2LjAwOC0yLjUwNC4wMDUtLjg3Ny4wMDctMS43ODMuMDA3LTIuNzE2IDAtMS42MjQtLjAwNy0yLjkxNS0uMDIyLTMuODc0LS4wMTYtLjk1OS0uMDI4LTEuODU0LS4wMzgtMi42ODZoNS4wMzd6Ii8+PC9nPjwvc3ZnPg=='
let configData = {}
let msgCenter, jikeIo

// 获取config
function getConfig (key) {
  chrome.storage.local.get(key, function (result) {
    if (typeof result !== 'undefined' && result.hasOwnProperty(key)) {
      configData[key] = result[key]
    }
  })
}

// 储存config
function setConfig (key, value, callback) {
  let obj = {}
  obj[key] = value
  configData[key] = value
  chrome.storage.local.set(obj, callback)
}

function refreshToken () {
  let authToken = configData['authToken']
  if (typeof authToken !== 'undefined') {
    let req = {
      'method': 'GET',
      'headers': {
        'x-jike-refresh-token': authToken
      }
    }
    return window.fetch('https://app.jike.ruguoapp.com/app_auth_tokens.refresh', req).then(resp => {
      if (resp.ok) {
        resp.json().then(resp => {
          setConfig('accessToken', resp['x-jike-access-token'])
          setConfig('authToken', resp['x-jike-refresh-token'])
          return true
        })
      } else {
        setConfig('accessToken', '')
        return false
      }
    })
  }
}

function getProfile () {
  let accessToken = configData['accessToken']
  if (accessToken !== '') {
    let req = {
      'method': 'GET',
      'headers': {
        'x-jike-access-token': accessToken
      }
    }
    return window.fetch('https://app.jike.ruguoapp.com/1.0/users/profile', req)
      .then(resp => {
        if (resp.ok) {
          return true
        } else if (resp.status === 401) {
          return refreshToken()
        }
      })
  } else {
    return false
  }
}

function initMsgCenter (accessToken) {
  if (accessToken !== '') {
    msgCenter = io('wss://msgcenter.jike.ruguoapp.com?x-jike-access-token=' + accessToken)
    msgCenter.on('connect', function () {
      console.log('connect msgCenter')
    })
    msgCenter.on('message', processMessage)
    msgCenter.on('connect_error', (error) => {
      console.log('connect_error')
      console.log(error)
      msgCenter.disconnect()
      scheduleJob = setInterval(init, 120000)
    })
    msgCenter.on('disconnect', function (reason) {
      console.log('disconnect msgCenter')
      console.log(reason)
      if (reason === 'transport close') {
        msgCenter.disconnect()
        scheduleJob = setInterval(init, 120000)
      }
    })
  }
}

function initJikeIo (accessToken) {
  if (accessToken !== '') {
    jikeIo = io('wss://jike-io.jike.ruguoapp.com?x-jike-access-token=' + accessToken)
    jikeIo.on('connect', function () {
      console.log('connect jikeIo')
    })
    jikeIo.on('message', processIo)
    jikeIo.on('connect_error', (error) => {
      console.log('connect_error')
      console.log(error)
      jikeIo.disconnect()
      scheduleJob = setInterval(init, 120000)
    })
    jikeIo.on('disconnect', function (reason) {
      console.log('disconnect jikeIo')
      console.log(reason)
      if (reason === 'transport close') {
        jikeIo.disconnect()
        scheduleJob = setInterval(init, 120000)
      }
    })
  }
}

// 检查是否有token，然后链接websocket
async function init () {
  getConfig('authToken')
  getConfig('accessToken')
  getConfig('nameList')
  let result = await getProfile()
  if (!result) {
    return
  }
  let accessToken = configData['accessToken']
  if (typeof msgCenter === 'undefined' || msgCenter.disconnected) {
    initMsgCenter(accessToken)
  }
  if (typeof jikeIo === 'undefined' || jikeIo.disconnected) {
    initJikeIo(accessToken)
  }
  clearInterval(scheduleJob)
}

let scheduleJob = setInterval(init, 10000)

// 注册监听器
// Win10原生通知点击后触发onButtonClicked，浏览器通知触发onClicked......
window.addEventListener('load', function () {
  getConfig('accessToken')
  getConfig('nameList')
  chrome.runtime.onMessage.addListener(tokenReceived)
  chrome.notifications.onClosed.addListener(notificationClosed)
  chrome.notifications.onClicked.addListener(notificationClicked)
  chrome.notifications.onButtonClicked.addListener(notificationBtnClick)
})

// 处理链接
function processUrl (jikeLink) {
  let url, id
  if (!jikeLink.startsWith('jike://')) return ''
  if (jikeLink.includes('/originalPost/')) {
    id = jikeLink.split('/originalPost/')[1]
    url = 'https://web.okjike.com/post-detail/' + id + '/originalPost'
  } else if (jikeLink.includes('/user/')) {
    id = jikeLink.split('/user/')[1]
    url = 'https://web.okjike.com/user/' + id
  } else if (jikeLink.includes('/comment/')) {
    id = jikeLink.split('&targetId=')[1]
    let commentId = jikeLink.split('?targetType=')[0].split('/comment/')[1]
    let post
    if (jikeLink.includes('ORIGINAL_POST')) {
      post = 'originalPost'
      url = 'https://web.okjike.com/post-detail/' + id + '/' + post + '?commentId=' + commentId
    } else if (jikeLink.includes('REPOST')) {
      post = 'repost'
      url = 'https://web.okjike.com/post-detail/' + id + '/' + post + '?commentId=' + commentId
    } else {
      console.log('Not supported link: ')
      console.log(jikeLink)
    }
  } else if (jikeLink.includes('/repost/')) {
    id = jikeLink.split('/repost/')[1]
    url = 'https://web.okjike.com/post-detail/' + id + '/repost'
  } else {
    console.log('Not supported link: ')
    console.log(jikeLink)
  }
  return url
}

// 处理通知列表
function processData (data) {
  let iconUrl, title, message, contextMessage
  contextMessage = new Date(data.createdAt).toLocaleString('zh-cn')
  switch (data.type) {
    case 'LIKE_PERSONAL_UPDATE':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      if (data.actionItem.usersCount === 1) {
        title = data.actionItem.users[0].screenName + ' 赞了你的动态'
      } else {
        title = data.actionItem.users[0].screenName + ' 等' + data.actionItem.usersCount + '人赞了你的动态'
      }
      message = data.referenceItem.content || '[图片]'
      break
    case 'LIKE_PERSONAL_UPDATE_COMMENT':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      if (data.actionItem.usersCount === 1) {
        title = data.actionItem.users[0].screenName + ' 赞了你的评论'
      } else {
        title = data.actionItem.users[0].screenName + ' 等' + data.actionItem.usersCount + '人赞了你的评论'
      }
      message = data.referenceItem.content || '[图片]'
      break
    case 'PERSONAL_UPDATE_REPOSTED':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 转发了你的动态'
      message = (data.referenceItem.content || '[图片]') + ' // ' + data.actionItem.content
      break
    case 'USER_FOLLOWED':
      iconUrl = data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 关注了你'
      message = data.actionItem.users[0].briefIntro
      break
    case 'REPLIED_TO_PERSONAL_UPDATE_COMMENT':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 回复了你的评论'
      message = (data.actionItem.content || '[图片]') + ' // ' + data.referenceItem.content
      break
    case 'COMMENT_PERSONAL_UPDATE':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 评论了你的动态'
      message = (data.actionItem.content || '[图片]') + ' // ' + data.referenceItem.content
      break
    case 'REPLY_TO_COMMENT':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 回复了你的动态'
      message = (data.actionItem.content || '[图片]') + ' // ' + data.referenceItem.content
      break
    case 'LIKE_QUESTION':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      if (data.actionItem.usersCount === 1) {
        title = data.actionItem.users[0].screenName + ' 赞了你的提问'
      } else {
        title = data.actionItem.users[0].screenName + ' 等' + data.actionItem.usersCount + '人赞了你的提问'
      }
      message = data.referenceItem.content || '[图片]'
      break
    case 'UPVOTE_ANSWER':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      if (data.actionItem.usersCount === 1) {
        title = data.actionItem.users[0].screenName + ' 赞了你的回答'
      } else {
        title = data.actionItem.users[0].screenName + ' 等' + data.actionItem.usersCount + '人赞了你回答'
      }
      message = data.referenceItem.content || '[图片]'
      break
    case 'COMMENT_ANSWER':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 评论了你的回答'
      message = (data.actionItem.content || '[图片]') + ' // ' + data.referenceItem.content
      break
    case 'ANSWER_QUESTION':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 回答了你的问题'
      message = data.actionItem.content || '[图片]'
      break
    case 'REPLIED_TO_ANSWER_COMMENT':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      title = data.actionItem.users[0].screenName + ' 回复了你的评论'
      message = (data.actionItem.content || '[图片]') + ' // ' + data.referenceItem.content
      break
    case 'LIKE_ANSWER_COMMENT':
      iconUrl = data.referenceItem.referenceImageUrl || data.actionItem.users[0].profileImageUrl
      if (data.actionItem.usersCount === 1) {
        title = data.actionItem.users[0].screenName + ' 赞了你的评论'
      } else {
        title = data.actionItem.users[0].screenName + ' 等' + data.actionItem.usersCount + '人赞了你评论'
      }
      message = data.referenceItem.content || '[图片]'
      break
    default:
      iconUrl = jikeLogo
      title = '暂时不支持的消息'
      message = '请在即刻APP查看'
      console.log('Not supported: ')
      console.log(data)
      break
  }
  try {
    chrome.notifications.create(processUrl(data.linkUrl), {
      type: 'basic',
      iconUrl,
      title,
      message,
      contextMessage
    })
  } catch (err) {
    console.error(err)
    console.log(iconUrl)
  }
}

// 获取通知列表
function getNotifications (unreadCount) {
  let accessToken = configData['accessToken']
  if (accessToken !== '') {
    let req = {
      'method': 'GET',
      'headers': {
        'x-jike-access-token': accessToken,
        'app-version': '4.10.0'
      }
    }
    return window.fetch('https://app.jike.ruguoapp.com/1.0/notifications/list', req).then(resp => {
      if (resp.ok) {
        return resp.json().then(function (resp) {
          let datas = resp.data
          for (let i = 0; i < unreadCount; i++) {
            let data = datas[i]
            processData(data)
          }
        })
      } else {
        if (refreshToken()) {
          getNotifications(unreadCount)
        }
      }
    })
  }
}

// 处理websocket返回的信息
function processIo (data) {
  let obj = JSON.parse(data)
  console.log(obj)
  chrome.notifications.create(obj.id, {
    type: 'basic',
    iconUrl: obj.user.avatarImage.picUrl,
    title: '收到来自 ' + obj.user.screenName + ' 的私信',
    message: obj.description
  })
}

function processId (obj) {
  // let url = ''
  let message
  let iconUrl = obj.data.actor.avatarImage.picUrl
  let screenName = obj.data.actor.screenName
  let id = obj.data.id
  let action = obj.data.action
  switch (action) {
    case 'CREATE_ORIGINAL_POST':
      // https://web.okjike.com/post-detail/5b743806509c5f001164f8a0/originalPost
      // url = 'https://web.okjike.com/post-detail/' + id + '/originalPost'
      message = screenName + ' 发动态了'
      break
    case 'CREATE_REPOST':
    case 'PERSONAL_UPDATE_REPOST':
    case 'REPOST':
      // https://web.okjike.com/post-detail/5b74383ea8bcac001168594c/repost
      // url = 'https://web.okjike.com/post-detail/' + id + '/repost'
      message = screenName + ' 转发动态了'
      break
    case 'CREATE_ANSWER':
      message = screenName + ' 答题了'
      break
    case 'CREATE_QUESTION':
      message = screenName + ' 发问题了'
      break
    case 'USER_FOLLOW':
    case 'SUBSCRIBE_TOPIC':
      message = screenName + ' 关注了...'
      return
    default:
      console.log('processId unknown')
      console.log(action)
  }
  if (message === '') return
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl,
    title: '即刻APP',
    message
  })
}

// 处理websocket返回的信息
function processMessage (data) {
  let accessToken, nameList
  accessToken = configData['accessToken']
  nameList = configData['nameList']
  if (!accessToken) return
  if (data.type === 'NOTIFICATION') {
    let unreadCount = data.data.unreadCount
    getNotifications(unreadCount)
  } else if (data.type === 'PERSONAL_UPDATE') {
    // CREATE_ORIGINAL_POST, PERSONAL_UPDATE_REPOST, REPOST, CREATE_REPOST, SUBSCRIBE_TOPIC, USER_FOLLOW, CREATE_QUESTION, CREATE_ANSWER
    // console.log(data)
    if (nameList) {
      let nameArray = nameList.split(',')
      for (let i = 0; i < nameArray.length; i++) {
        if (nameArray[i] === data.data.actor.screenName) {
          processId(data)
        }
      }
    }
  } else if (data.type === 'TICKET_MESSAGE_NOTIFICATION') {
    console.log('TICKET_MESSAGE_NOTIFICATION')
    console.log(data)
  } else {
    console.log('UNKNOWN MESSAGE:')
    console.log(data)
  }
}

// 得到token
function tokenReceived (request, sender, sendResponse) {
  if (request.type === 'token') {
    console.log('access-token: ' + request.accessToken)
    console.log('auth-token: ' + request.authToken)
    setConfig('accessToken', request.accessToken)
    setConfig('authToken', request.authToken)
  }
  if (request.nameList) {
    console.log('nameList: ' + request.nameList)
    setConfig('nameList', request.nameList)
  }
  if (request.command === 'getNameList') {
    let nameList = configData['nameList']
    sendResponse({
      nameList
    })
  }
}

// 通知关闭
function notificationClosed (notID, bByUser) {
  console.log("The notification '" + notID + "' was closed" + (bByUser ? ' by the user' : ''))
}

// 通知被点击
function notificationClicked (notID) {
  if (notID.includes('https://')) {
    chrome.tabs.create({
      url: notID
    })
  }
  chrome.notifications.clear(notID)
}

// 通知按钮被点击
function notificationBtnClick (notID, iBtn) {
  if (notID.includes('https://') && iBtn === -1) {
    chrome.tabs.create({
      url: notID
    })
  }
  chrome.notifications.clear(notID)
}
