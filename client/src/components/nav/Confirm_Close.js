import React from 'react';

const ConfirmClose = ({
  mobile,
  update,
  repost,
  setUpdate,
  confirmClose,
  setConfirmClose,
  allowScroll,
  resetInputs,
  formActive,
  setFormActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen
}) => {
  
  if (confirmClose) {
    return (
      <React.Fragment>
        <div className='confirmCloseModal' />
        <div
          className={update ? 'confirmCloseContainer update' : 'confirmCloseContainer'}
        >
          <span 
            className='discardTitle'
          >
            Discard this post?
          </span>
          <div>
            <div
              className='cancel'
              onClick={() => {
                setConfirmClose(confirmClose = false)
              }}
            >
              <span>Nevermind</span>
            </div>
            <div
              className='discard'
              onClick={() => {
                if (update) {
                  allowScroll(document)
                  resetInputs()
                  setConfirmClose(confirmClose = false)
                  setUpdate(update = false)
                } else if ((repost && mobile) || mobile) {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setConfirmClose(confirmClose = false)
                  setPostFormModal(postFormModal = false)
                  setPostFormOpen(postFormOpen = false)
                } else if (repost) {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setConfirmClose(confirmClose = false)
                } else {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setPostFormModal(postFormModal = false)
                  setConfirmClose(confirmClose = false)
                }
              }}
            >
              <span>Discard</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default ConfirmClose;