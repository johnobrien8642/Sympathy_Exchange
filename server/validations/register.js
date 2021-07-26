import Validator from 'validator'
import validText from './valid_text.js'


function validateRegisterInput(data) {
  data.username = validText(data.username) ? data.username : '';
  data.password = validText(data.password) ? data.password : '';
  
  if (Validator.isEmpty(data.username)) {
    return { message: 'Username cannot be empty', isValid: false }
  }

  if (Validator.isEmpty(data.password)) {
    return { message: 'Password cannot be empty', isValid: false }
  }

  if (!Validator.isLength(data.password, { min: 7, max: 33 })) {
    return { message: 'Password must be a minimum of 8 and no longer than 32 characters', isValid: false }
  }

  return {
    message: '',
    isValid: true
  }
}

export default validateRegisterInput;