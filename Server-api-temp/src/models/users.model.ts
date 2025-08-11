import mongoose from 'mongoose';



export const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value: string) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(value);
      },
      message: "Please enter a valid email address"
    }
  },
  name: {
    required: true,
    type: String,
  },
  role:{
    required:true,
    ref: 'Role',
    type:String,
  },
  picture: {
    type: String,
    required: false,
  },
  addedAt: {
    required: false,
    type: Date,
  }
});

const User = mongoose.model("User", userSchema);

export default User;
