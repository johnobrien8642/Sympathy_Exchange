import jwt from 'jsonwebtoken';
import keys from '../../config/keys.js';
import Cookies from 'js-cookie';
import randomWords from 'random-words';
import validateRegisterInput from '../validations/register.js';
import validateLoginInput from '../validations/login.js';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import User from '../models/User.js';

const register = async (data, ctx) => {
  try {
  const { message, isValid } = validateRegisterInput(data);

  if (!isValid) {
    throw new Error(message)
  };

  const { username, password, secretRecoveryPhrase } = data;

  const hashedPW = await bcrypt.hash(password, 10);

  const user = new User(
    {
      username: username,
      password: hashedPW,
      oldPasswords: [hashedPW],
      secretRecoveryPhraseHash: CryptoJS.SHA1(secretRecoveryPhrase).toString(),
      secretRecoveryPhrase: CryptoJS.AES.encrypt(secretRecoveryPhrase, keys.secretKeyForRecoveryPhrase)
    },
    err => {
      if (err) throw err;
    }
  )
  
  const token = await jwt.sign({ _id: user._id }, keys.secretOrKey)
  const timedSecretRecoveryPhraseAccessToken = await jwt.sign({ secretRecoveryPhrase: user.secretRecoveryPhrase }, keys.secretOrKey, { expiresIn: "1h"})
  
  return user.save().then(user => {
    return { token, timedSecretRecoveryPhraseAccessToken, loggedIn: true, ...user._doc, ...user.username}
  })

  } catch (err) {
    throw err;
  }
}

const generateRandomUsername = async () => {
  let unique = false
  var randomUsername, username

  while (!unique) {
    randomUsername = randomWords(3).join('_')
    username = await User.findOne({ username: randomUsername })
    
    if (!username) {
      unique = true
    };
  };
  
  return randomUsername
}

const logout = async data => {
  try {
    const decoded = jwt.verify(data, keys.secretOrKey);
    const { _id } = decoded;

    const user = await User.findById(_id);
    
    return { loggedIn: false, ...user._doc }
  } catch (err) {
    throw err;
  }
}

const login = async data => {
  try {
    const { message, isValid } = validateLoginInput(data)

    if (!isValid) {
      throw new Error(message)
    }

    const { username, password } = data;

    const user = await User.findOne({ username })

    if (!user) {
      throw new Error('User with that username does not exist')
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ _id: user._id }, keys.secretOrKey)
      return { token, loggedIn: true, ...user._doc, ...user.username}
    } else {
      throw new Error('Password is incorrect')
    }
  } catch(err) {
    throw err;
  }
}

const verify = async data => {
  try {
    const decoded = jwt.verify(data.token, keys.secretOrKey);
    const { _id } = decoded;
   
    const user = await User.findById({ _id });

    let loggedIn;
    
    if (user) {
      loggedIn = true;
      return { loggedIn, _id }
    } else {
      loggedIn = false;
      return { loggedIn }
    }
  } catch(err) {
    throw err
  }
}

export default { register, generateRandomUsername, logout, login, verify };