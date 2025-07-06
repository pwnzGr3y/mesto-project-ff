const secretConfig = {
  cohortUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
  headers: {
    'authorization': 'ef79f44c-8e47-4762-8710-738aafe78eb9',
    'Content-Type': 'application/json',
  },
}

function handleResponse(res) {
  if (res.ok) {
    return res.json()
  }
  return res.json().then((errData) => {
    return Promise.reject(`Error ${res.status}: ${JSON.stringify(errData)}`)
  })
}

function apiGetUsersMe(config) {
  return fetch(`${config.cohortUrl}/users/me`, {
    headers: config.headers,
  }).then(handleResponse)
}

function apiGetCards(config) {
  return fetch(`${config.cohortUrl}/cards`, {
    headers: config.headers,
  }).then(handleResponse)
}

function apiChangeUserInfo(config, newName, newJob) {
  return fetch(`${config.cohortUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newJob,
    }),
  }).then(handleResponse)
}

function apiAddOneMoreCard(config, newName, newLink) {
  return fetch(`${config.cohortUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      link: newLink,
    }),
  }).then(handleResponse)
}

function apiSetLikeCard(config, cardId, isLiked) {
  return fetch(`${config.cohortUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers,
  }).then(handleResponse)
}

function apiDeleteCard(config, cardId) {
  return fetch(`${config.cohortUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(handleResponse)
}

function apiSetAvatar(config, avatarLink) {
  return fetch(`${config.cohortUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarLink }),
  }).then(handleResponse)
}

export {
  apiAddOneMoreCard,
  apiChangeUserInfo,
  apiDeleteCard,
  apiGetCards,
  apiGetUsersMe,
  apiSetAvatar,
  apiSetLikeCard,
  secretConfig,
}
