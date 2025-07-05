/* Идентификатор нашей когорты:  wff-cohort-41
Твой токен:  ef79f44c-8e47-4762-8710-738aafe78eb9 */
export {
  API_addOneMoreCard,
  API_changeUserInfo,
  API_deleteCard,
  API_getCards,
  API_getUsersMe,
  API_setAvatar,
  API_setLikeCard,
  secretConfig,
}

const secretConfig = {
  cohortUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
  headers: {
    'authorization': 'ef79f44c-8e47-4762-8710-738aafe78eb9',
    'Content-Type': 'application/json',
  },
}

function API_getUsersMe(config) {
  return fetch(`${config.cohortUrl}/users/me`, {
    headers: config.headers,
  })
    .then(res => handleResponse(res))
};

function API_getCards(config) {
  return fetch(`${config.cohortUrl}/cards`, {
    headers: config.headers,
  })
    .then(res => handleResponse(res))
};

function handleResponse(res) {
  if (res.ok) {
    return res.json()
  }
  return res.json().then((errData) => {
    return Promise.reject(`Error ${res.status}: ${JSON.stringify(errData)}`)
  })
};

function API_changeUserInfo(config, newName, newJob) {
  return fetch(`${config.cohortUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newJob,
    }),
  })
    .then(res => handleResponse(res))
};

function API_addOneMoreCard(config, newName, newLink) {
  return fetch(`${config.cohortUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      link: newLink,
    }),
  })
    .then(res => handleResponse(res))
};

function API_setLikeCard(config, card_id, isLiked) {
  return fetch(`${config.cohortUrl}/cards/likes/${card_id}`, {
    method: (isLiked) ? 'DELETE' : 'PUT',
    headers: config.headers,
  })
    .then(res => handleResponse(res))
};

function API_deleteCard(config, card_id) {
  return fetch(`${config.cohortUrl}/cards/${card_id}`, {
    method: 'DELETE',
    headers: config.headers,
  })
    .then(res => handleResponse(res))
};

function API_setAvatar(config, avatar_link) {
  return fetch(`${config.cohortUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatar_link }),
  })
    .then(res => handleResponse(res))
};
