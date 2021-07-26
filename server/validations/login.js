import Validator from 'validator';
import validText from './valid_text.js';


function validateLoginInput(data) {
  data.username = validText(data.username) ? data.username : '';
  data.password = validText(data.password) ? data.password : '';

  if (Validator.isEmpty(data.username)) {
    return { message: 'Username cannot be empty', isValid: false }
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