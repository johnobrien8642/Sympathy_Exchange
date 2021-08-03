import React from 'react';

const ConfirmClose = ({
  confirm,
  cancelBool,
  cancel,
  resetForm,
}) => {
  
  return (
    <div
      className={cancelBool ? 'confirmCloseContainer active' : 'confirmCloseContainer none'}
    >
      <div className='confirmCloseModal'/>

      <div
        className='innerConfirmCloseContainer'
      >
        <h3>Are you sure? All text will be lost.</h3>

        <div
          className='cancelOrConfirmContainer'
        >
          <button
            type='button'
            className='cancel'
            onClick={() => {
              cancel(false);
            }}
          >
            Cancel
          </button>

          <button
            type='button'
            className='confirm'
            onClick={() => {
              resetForm();
              confirm(false);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmClose;