import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  oldPasswords: [
    {
      type: String
    }
  ],
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  token: {
    type: String,
    required: false
  },
  loggedIn: {
    type: Boolean,
    required: false
  },
  savedPleasAndVariants: [
    {
      type: Schema.Types.ObjectId,
      refPath: 'onModel'
    }
  ],
  tagFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      index: true
    }
  ],
  // Uncomment both below for email auth
  // Go to server/services/auth_util/register and uncomment
  authenticated: {
    type: Boolean,
    default: false
  },
  emailAuthToken: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [ 'Plea', 'Variant' ]
  },
  kind: {
    type: String,
    default: 'User'
  }
})

const User = mongoose.model('User', UserSchema, 'users');

export default User;
