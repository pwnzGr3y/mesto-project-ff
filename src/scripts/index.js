import { createCard } from '../components/card'
import { closePopup, openPopup, setModalWindowEventListeners } from '../components/modal'
import {
  apiChangeUserInfo,
  apiDeleteCard,
  apiGetCards,
  apiGetUsersMe,
  apiSetAvatar,
  secretConfig,
} from './api.js'

import { clearValidation, enableValidation } from './validation.js'
import '../pages/index.css'

let userMe

const formEditProfile = document.querySelector('[name="edit-profile"]')
const nameInput = formEditProfile.querySelector('.popup__input_type_name')
const descriptionInput = formEditProfile.querySelector('.popup__input_type_description')

const profileImage = document.querySelector('.profile__image')
const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const changeAvatarPopup = document.querySelector('.popup_type_change-avatar')
const changeAvatarForm = changeAvatarPopup.querySelector('form')
const avatarNewURLInput = changeAvatarPopup.querySelector('[name="new-avatar-url"]')

const formNewPlace = document.querySelector('[name="new-place"]')
const cardNameInput = formNewPlace.querySelector('[name="new-place-name"]')
const cardNewURLInput = formNewPlace.querySelector('[name="new-card-url"]')

const imagePopup = document.querySelector('.popup_type_image')
const imagePopupImage = imagePopup.querySelector('.popup__image')
const imagePopupCaption = imagePopup.querySelector('.popup__caption')

const deleteCardPopup = document.querySelector('.popup_type_delete-card')
const deleteCardForm = document.querySelector('[name="delete-card"]')

const placesList = document.querySelector('.places__list')

const addButton = document.querySelector('.profile__add-button')
const addPopup = document.querySelector('.popup_type_new-card')
const addForm = addPopup.querySelector('.popup__form')

const editButton = document.querySelector('.profile__edit-button')
const editPopup = document.querySelector('.popup_type_edit')

const popUps = document.querySelectorAll('.popup')

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
}

function beforeChangeAvatarPopupOpened() {
  avatarNewURLInput.value = '' // исправлено: полностью очищаем поле
  clearValidation(changeAvatarForm, validationConfig)
}

function beforeNewCardPopupOpened() {
  cardNameInput.value = ''
  cardNewURLInput.value = ''
  clearValidation(addForm, validationConfig)
}

function beforeEditPopupOpened() {
  nameInput.value = profileTitle.textContent
  descriptionInput.value = profileDescription.textContent
  clearValidation(formEditProfile, validationConfig)
}

function openCardPopup(title, link) {
  imagePopupImage.src = link
  imagePopupImage.alt = title
  imagePopupCaption.textContent = title

  openPopup(imagePopup, null)
}

function handleNewPlaceFormSubmit(event) {
  event.preventDefault()

  const newName = cardNameInput.value
  const newLink = cardNewURLInput.value

  const submitButton = event.submitter
  const originalTextContent = submitButton.textContent
  submitButton.textContent = 'Сохранение...'
  submitButton.disabled = true

  apiAddOneMoreCard(secretConfig, newName, newLink)
    .then((newCardFromServer) => {
      renderCard({ cardObject: newCardFromServer }) // используем то, что вернул сервер
      formNewPlace.reset() // сброс формы только при успехе
      closePopup(addPopup)
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err)
    })
    .finally(() => {
      submitButton.textContent = originalTextContent
      submitButton.disabled = false
    })
}

function renderCard({ cardObject, canDelete = true, isLiked = false, method = 'prepend' }) {
  placesList[method](
    createCard({
      cardObject,
      deleteFunction: deleteCard,
      onCardClickFunction: openCardPopup,
      canDelete,
      isLiked,
    }),
  )
}

function showProfile() {
  profileTitle.textContent = userMe.name
  profileDescription.textContent = userMe.about
  profileImage.style.backgroundImage = `url(${userMe.avatar})`
}

function submitDeleteCard(event, cardElement, cardId) {
  event.preventDefault()

  const submitButton = event.submitter
  const originalTextContent = submitButton.textContent
  submitButton.textContent = 'Удаление...'
  submitButton.disabled = true

  apiDeleteCard(secretConfig, cardId)
    .then(() => {
      cardElement.remove()
      closePopup(deleteCardPopup)
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err)
    })
    .finally(() => {
      submitButton.textContent = originalTextContent
      submitButton.disabled = false
    })
}

function deleteCard(delButton, cardId) {
  const cardElement = delButton.closest('.card')
  openPopup(deleteCardPopup, null)
  deleteCardForm.onsubmit = evt => submitDeleteCard(evt, cardElement, cardId)
}

Promise.all([apiGetUsersMe(secretConfig), apiGetCards(secretConfig)])
  .then(([user, cardsArray]) => {
    userMe = user
    showProfile()

    cardsArray.forEach((card) => {
      const canDelete = (card.owner._id === userMe._id)
      const isLiked = card.likes.some(user => user._id === userMe._id)
      renderCard({
        cardObject: card,
        canDelete,
        isLiked,
        method: 'append',
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })

profileImage.addEventListener('click', () => openPopup(changeAvatarPopup, beforeChangeAvatarPopupOpened))

addButton.addEventListener('click', () => openPopup(addPopup, beforeNewCardPopupOpened))
editButton.addEventListener('click', () => openPopup(editPopup, beforeEditPopupOpened))
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit)

changeAvatarForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const input = changeAvatarForm.querySelector('#input_avatar-image')
  const newAvatarUrl = input.value

  const submitButton = event.submitter
  const originalTextContent = submitButton.textContent
  submitButton.textContent = 'Сохранение...'
  submitButton.disabled = true

  apiSetAvatar(secretConfig, newAvatarUrl)
    .then((updatedUser) => {
      profileImage.style.backgroundImage = `url(${updatedUser.avatar})`
      changeAvatarForm.reset() // сброс формы только при успехе
      closePopup(changeAvatarPopup)
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err)
    })
    .finally(() => {
      submitButton.textContent = originalTextContent
      submitButton.disabled = false
    })
})

formEditProfile.addEventListener('submit', (event) => {
  event.preventDefault()
  const newName = nameInput.value
  const newJob = descriptionInput.value

  const submitButton = event.submitter
  const originalTextContent = submitButton.textContent
  submitButton.textContent = 'Сохранение...'
  submitButton.disabled = true

  apiChangeUserInfo(secretConfig, newName, newJob)
    .then((data) => {
      profileTitle.textContent = data.name
      profileDescription.textContent = data.about
      closePopup(editPopup)
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err)
    })
    .finally(() => {
      submitButton.textContent = originalTextContent
      submitButton.disabled = false
    })
})

popUps.forEach((ModalWidow) => {
  setModalWindowEventListeners(ModalWidow)

  const form = ModalWidow.querySelector(validationConfig.formSelector)
  if (form) {
    clearValidation(form, validationConfig)
  }
})

enableValidation(validationConfig)
