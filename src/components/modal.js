export {
  closePopup,
  openPopup,
}

export function setModalWindowEventListeners(modalWindow) {
  modalWindow.classList.add('popup_is-animated')

  const closeCross = modalWindow.querySelector('.popup__close')
  closeCross.addEventListener('click', () => { closePopup(modalWindow) })

  modalWindow.addEventListener('click', (event) => {
    if (!event.target.classList.contains('.popup__content')) {
      closePopup(event.target)
    }
  })
}

function openPopup(popup, beforeFunction) {
  if (beforeFunction !== null) {
    beforeFunction()
  }
  popup.classList.add('popup_is-opened')
  document.addEventListener('keydown', handleEscClose)
}

function closePopup(popup) {
  popup.classList.remove('popup_is-opened')
  document.removeEventListener('keydown', handleEscClose)
}

function handleEscClose(event) {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened')
    if (openedPopup)
      closePopup(openedPopup)
  }
}
