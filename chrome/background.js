(function () {
  const jikeLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDAgNDAiPjxkZWZzPjxyZWN0IGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIvPjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjkwLjM3NCUiIHgyPSI3OC42MDQlIiB5MT0iNjguMTk4JSIgeTI9IjY4LjE5OCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RUMxRjkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1RUI4RjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjx1c2UgZmlsbD0iI0ZGRTQxMSIgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNLjk4OSAyMC44M2EuNTIuNTIgMCAwIDEtLjA1NC4wMWwxLjcyIDEuNjc3YzEuNjU0LS4xNTIgMy4yNzMtLjU4NyA0LjQ2NS0xLjAxOCAxLjE5My0uNDMyIDIuMTc0LS45ODcgMi45NDUtMS42NjdhNi4yMjcgNi4yMjcgMCAwIDAgMS43MTMtMi40NWMuMzctLjk1NC41NTUtMi4wNTUuNTU1LTMuMzAzVjcuOTE1YzAtMS4zOS4wMDUtMi41OTUuMDE1LTMuNjE0LjAxLTEuMDIuMDE2LTEuOTQuMDE2LTIuNzYzTDEwLjQ0LjAwM2MwIC44MjEtLjAwNSAxLjc0MS0uMDE1IDIuNzYtLjAxIDEuMDE5LS4wMTUgMi4yMjQtLjAxNSAzLjYxNHY2LjE2NGMwIDEuMjQ4LS4xODUgMi4zNDktLjU1NSAzLjMwMmE2LjIyNyA2LjIyNyAwIDAgMS0xLjcxMyAyLjQ1Yy0uNzcuNjgtMS43NTIgMS4yMzYtMi45NDUgMS42NjctMS4xNzcuNDI2LTIuNTguNzE2LTQuMjA4Ljg3eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuOTQ5IDkuMzU5KSIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMy4zOSA5LjM1OWMwIC44MjItLjAwNiAxLjc0My0uMDE2IDIuNzYyLS4wMSAxLjAyLS4wMTUgMi4yMjUtLjAxNSAzLjYxNVYyMS45YzAgMS4yNDgtLjE4NSAyLjM0OS0uNTU2IDMuMzAyYTYuMjI3IDYuMjI3IDAgMCAxLTEuNzEyIDIuNDVjLS43NzEuNjgtMS43NTMgMS4yMzYtMi45NDUgMS42NjctMS4xOTIuNDMxLTIuNjE1LjcyMy00LjI2OS44NzVsLS45MjgtMy45ODdhMTYuNzIgMTYuNzIgMCAwIDAgMi4yMzctLjQwNCA0LjY2IDQuNjYgMCAwIDAgMS42NzQtLjc5OWMuNTA3LS4zOTUuODktLjg5MiAxLjE1LTEuNDkxLjI1OC0uNTk5LjM4Ny0xLjM5LjM4Ny0yLjM3NCAwLS43OTIuMDAzLTEuNjI2LjAwOC0yLjUwNC4wMDUtLjg3Ny4wMDctMS43ODMuMDA3LTIuNzE2IDAtMS42MjQtLjAwNy0yLjkxNS0uMDIyLTMuODc0LS4wMTYtLjk1OS0uMDI4LTEuODU0LS4wMzgtMi42ODZoNS4wMzd6Ii8+PC9nPjwvc3ZnPg=='
  let token, notifyId
  function getSavedToken () {
    chrome.storage.local.get(['token'], function (result) {
      token = result.token
    })
  };

  function setSavedToken (value) {
    chrome.storage.local.set({
      token: value
    })
  };

  function getSavedNotifyId () {
    chrome.storage.local.get(['notifyId'], function (result) {
      notifyId = result.notifyId
    })
  };

  function setSavedNotifyId (value) {
    chrome.storage.local.set({
      notifyId: value
    })
  }

  function processNotification (data) {
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
          title = data.actionItem.users[0].screenName + '赞了你的评论'
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
      default:
        iconUrl = jikeLogo
        title = '暂时不支持的消息'
        message = '请在即刻APP查看'
        console.log('Not supported: ' + data)
        break
    }
    chrome.notifications.create(data.linkUrl, {
      type: 'basic',
      iconUrl,
      title,
      message,
      contextMessage
    })
  }

  function notifyWorker () {
    let req = {
      'method': 'GET',
      'headers': {
        'x-jike-app-auth-jwt': token,
        'app-version': '4.7.0'
      }
    }
    window.fetch('https://app.jike.ruguoapp.com/1.0/notifications/list', req)
      .then(function (resp) {
        return resp.json()
      }).then(function (resp) {
        let datas = resp.data
        getSavedNotifyId()
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].id === notifyId) break
          let data = datas[i]
          processNotification(data)
        }
        setSavedNotifyId(datas[0].id)
      })
  }

  chrome.alarms.onAlarm.addListener(function (alarm) {
    getSavedToken()
    if (alarm.name === 'fetcher' && token) {
      notifyWorker()
    }
  })

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.token) {
        setSavedToken(request.token)
        sendResponse({
          callback: request.token
        })
      }
    }
  )

  chrome.notifications.onClicked.addListener(function (notificationId) {
    let url, id
    if (!notificationId.startsWith('jike')) return
    if (notificationId.includes('originalPost')) {
      id = notificationId.split('/originalPost/')[1]
      url = 'https://web.okjike.com/post-detail/' + id + '/originalPost'
    } else if (notificationId.includes('user')) {
      id = notificationId.split('/user/')[1]
      url = 'https://web.okjike.com/user/' + id
    } else if (notificationId.includes('comment')) {
      id = notificationId.split('&targetId=')[1]
      let commentId = notificationId.split('?targetType=')[0].split('/comment/')[1]
      let post = notificationId.includes('ORIGINAL_POST') ? 'originalPost' : 'repost'
      url = 'https://web.okjike.com/post-detail/' + id + '/' + post + '?commentId=' + commentId
    } else if (notificationId.includes('repost')) {
      id = notificationId.split('/repost/')[1]
      url = 'https://web.okjike.com/post-detail/' + id + '/repost'
    } else {
      console.log('Not supported link: ' + notificationId)
    }
    chrome.tabs.create({
      url
    })
    chrome.notifications.clear(notificationId)
  })

  chrome.alarms.create('fetcher', {
    periodInMinutes: 5
  })
})()
