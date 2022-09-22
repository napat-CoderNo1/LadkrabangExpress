const userModel = require("../model/user.js");
const ticketModel = require("../model/ticket.js");
const refundModel = require("../model/refund.js");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Train = require("./trainDAO.js");
const { default: mongoose } = require("mongoose");

class User {
  static async register(req, res) {
    try {
      console.log(req.body);

      const { firstname, lastname, email, username, password } = req.body;

      if (!(firstname && lastname && email && username && password)) {
        res.status(400).send("All input required");
      }

      const oldUser = await userModel.findOne({ email });
      const oldUsername = await userModel.findOne({ username });

      if (oldUser || oldUsername) {
        return res.status(409).send("User existed");
      }
      const encrytedPassword = await bcrypt.hash(password, 10);

      const user = new userModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        username: username,
        password: encrytedPassword,
      });

      const token = jsonwebtoken.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2d" }
      );

      user.token = token;
      user.save();
      const result = user.toObject();
      result.isStaff = false;
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!(username && password)) {
        res.status(400).send("All input required");
      }

      //check is user input username or email
      let user = Object;
      if (username.includes("@")) {
        user = await userModel.findOne({ email: username });
      } else {
        user = await userModel.findOne({ username: username });
      }

      if (user === null) {
        res.status(400).send("username not found");
        return;
      }

      const email = user.email;
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jsonwebtoken.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2d",
          }
        );
        user.token = token;
        user.save();

        const result = user.toObject();
        delete result.password;
        result.isStaff = false;
        res.status(201).json(result);
      } else {
        res.status(400).send("Invalid login");
      }
    } catch (err) {
      console.log(err);
      res.send("error in backend");
    }
  }

  static verifyTokenGetUserID(token) {
    try {
      const decoded = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
      return decoded.user_id;
    } catch (err) {
      return false;
    }
  }

  static async showUserProfile(req, res) {
    try {
      // front ส่ง token เราเอา token มาหา id
      const userID = await User.verifyTokenGetUserID(req.body.token);
      // console.log(userID)
      const objUserID = mongoose.Types.ObjectId(userID);

      // foundTicket => array of document ทุก documenyt ที่มี id ตรงกับ ที่ login เข้ามา
      const foundTicket = await ticketModel.find({ user_id: objUserID });

      let result = [];
      for (let i = 0; i < foundTicket.length; i++) {
        let de = foundTicket[i].departureTime.split(":");
        let ar = foundTicket[i].arrivalTime.split(":");
        let duration = Train.calculateTravelDuration(
          Number(de[0]),
          Number(de[1]),
          Number(ar[0]),
          Number(ar[1])
        );

        const temp = foundTicket[i].toObject();
        temp.duration = duration;
        result.push(temp);
      }

      res.send(result.reverse());
    } catch (err) {
      console.log(err);
      res.send("Error from back");
    }
  }

  static async refund(req, res) {
    try {
      const { token, ticketID, reason } = req.body;

      const userID = User.verifyTokenGetUserID(token);
      if (userID === false) {
        return res.send("Token expired").status(401);
      }
      const foundTicket = await ticketModel.findById(
        mongoose.Types.ObjectId(ticketID)
      );
      if (!foundTicket) {
        return res.send("Ticket not found").status(404);
      }

      const localTime = new Date();

      const refundAdded = new refundModel({
        ticketID: foundTicket._id,
        userID: mongoose.Types.ObjectId(userID),
        ticketInfo: foundTicket.toObject(),
        reason: reason,
        timestamp: localTime.toLocaleString("th-TH"),
      });

      refundAdded.save();

      res.send(refundAdded).status(200);
    } catch (err) {
      console.log(err);
      res.send("Error in back");
    }
  }

  static async editProfile(req, res) {
    try {
      const { token, firstname, lastname, username, email } = req.body;
      const userID = await User.verifyTokenGetUserID(token);
      console.log(userID);
      if (userID === false) {
        return res.send("Expired token").status(201);
      }

      //check is username and email exit
      const foundEmail = await userModel.findOne({ email: email });
      const foundUsername = await userModel.findOne({ username: username });

      if (foundEmail) {
        if (foundEmail._id != userID) {
          return res.status(204).send();
        }
      }
      if (foundUsername) {
        if (foundUsername._id != userID) {
          return res.status(204).send();
        }
      }

      const foundUser = await userModel.findById(
        mongoose.Types.ObjectId(userID)
      );
      console.log(foundUser);
      foundUser.firstname = firstname;
      foundUser.lastname = lastname;
      foundUser.username = username;
      foundUser.email = email;

      foundUser.save();
      const result = foundUser.toObject();
      delete result.password;
      res.send(result).status(200);
    } catch (err) {
      console.log(err);
      res.send("Error in back").status(500);
    }
  }

  static async confirmOldPassword(req, res) {
    try {
      const { token, password } = req.body;
      const userID = await User.verifyTokenGetUserID(token);
      if (userID === false) {
        return res.send("Token expired").status(400);
      }
      const user = await userModel.findById(mongoose.Types.ObjectId(userID));
      if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json("Password correct");
      } else {
        res.status(400).send("Password incorrect");
      }
    } catch (err) {
      console.log(err);
      res.send("Error in back");
    }
  }

  static async changePassword(req, res) {
    try {
      const { token, password } = req.body;
      const userID = await User.verifyTokenGetUserID(token);
      if (userID === false) {
        return res.send("Token expired").status(400);
      }
      const user = await userModel.findById(mongoose.Types.ObjectId(userID));

      user.password = await bcrypt.hash(password, 10);
      user.save();
      const result = user.toObject();
      delete result.password;
      result.isStaff = false;
      res.status(200).send("Password has changed");
    } catch (err) {
      console.log(err);
      res.send("Error in back").status(500);
    }
  }

  static async verifyEmailResetPassword(req, res) {
    try {
      const { email } = req.body;
      const foundUser = await userModel.findOne({ email: email });
      if (!foundUser) {
        return res.send("Email not found").status(404);
      }
      const result = {
        userID: foundUser.userID,
      };
      res.send(result).status(200);
    } catch (err) {
      console.log(err);
      res.send("Error in back").status(500);
    }
  }

  static async forgot(req, res) {
    try {
      const { email } = req.body;
      const foundEmail = await userModel.findOne({ email: email });
      const foundUsername = await userModel.findOne({ username: email });

      let userID = null;
      let tempEmail = null;
      if (foundEmail || foundUsername) {
        if (foundEmail) {
          userID = foundEmail._id;
          // console.log(foundEmail._id)
          tempEmail = foundEmail.email;
        } else if (foundUsername) {
          userID = foundUsername._id;
          // console.log(oundUsername._id)
          tempEmail = foundUsername.email;
        }
      } else {
        res.status(400).send("Not found");
      }
      // console.log("cat" + userID)
      const token = jsonwebtoken.sign(
        { user_id: userID },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      const result = {
        token: token,
        email: tempEmail,
      };
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error in back");
    }
  }

  static async forgotChangePassword(req, res) {
    try {
      const { token, password } = req.body;
      const decoded = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
      const foundUser = await userModel.findById(
        mongoose.Types.ObjectId(decoded.user_id)
      );

      if (!foundUser) {
        return res.send("User not found").status(400);
      }
      foundUser.password = await bcrypt.hash(password, 10);
      foundUser.save();
      res.send("Change password complet, Please login");
    } catch (err) {
      console.log(err);
      res.send("Error in back");
    }
  }
}

module.exports = User;
