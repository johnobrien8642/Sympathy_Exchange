import Validator from 'validator';
import validText from './valid_text.js';


function validateLoginInput(data) {
  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email)) {
    return { message: 'Email cannot be empty', isValid: false }
  }
  if (!Validator.isEmail(data.email)) {
    return { message: 'Email is invalid', isValid: false }
  }

  if (Validator.isEmpty(data.password)) {
    return { message: 'Password cannot be empty', isValid: false }
  }

  return {
    message: '',
    isValid: true
  }
}

export default validateLoginInput;