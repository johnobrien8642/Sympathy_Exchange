import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  oldPasswords: [
    {
      type: String
    }
  ],
  token: {
    type: String,
    required: false
  },
  loggedIn: {
    type: Boolean,
    required: false
  },
  sympathizedPleaIdStringArr: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    }
  ],
  savedPleaIdsStringArr: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    }
  ],
  userFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tagFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  secretRecoveryPhraseHash: {
    type: String,
    required: true,
    index: true
  },
  secretRecoveryPhrase: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'User'
  }
})

const User = mongoose.model('User', UserSchema, 'users');

export default User;
