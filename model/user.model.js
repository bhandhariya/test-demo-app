const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    name: {
        type: Schema.Types.String,
        
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
    },
    permissions: {
        type: Object,
        of: { type: Boolean },
        default: {}
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
  });
  
  // Method to compare provided password with the hashed one
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("user", userSchema);


