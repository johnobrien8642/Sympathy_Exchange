// import Validator from 'validator';

const validateUrlInput = ({ input }) => {
  var validated = ''
  validated = Validator.isURL(input) ? input : ''
  
  return validated
}

const ValidateFormInput = { validateUrlInput };

export default ValidateFormInput;

