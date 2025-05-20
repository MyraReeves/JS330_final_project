const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, minlength: 2},
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  roles: { type: [String], required: true, enum: ["user", "admin"], default: ["user"] },
}, { timestamps: true} );

// Hash password before saving:
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  catch (error){
    next(error);
  }
});

// Helper method to compare password during login:
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);