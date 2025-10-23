import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transport from "../email.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    /* if already registered */
    if (user) {
      return res
        .status(400)
        .json({ message: "User already registered with given email." });
    }
    /* if not then create a newuser*/
    const hashedPwd = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPwd,
    });

    res.status(201).json({
      message: "User has been registered successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some Server error found",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "User not found with this credentials",
      });
    }
    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    //if all corret
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      message: "User login successfully",
    });
    console.log(process.env.SMTP_HOST);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error found",
    });
  }
};

export const logout = async (req, res) => {
  res.json({ message: "logout succesfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log(user);
    return res.status(404).json({ message: "Email not found" });
  }
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT, {
    expiresIn: "30m",
  });
  user.resetToken = resetToken;
  user.resetTknExpiry = Date.now() + 30 * 60 * 1000;
  await user.save();

  console.log(process.env.SMTP_PORT);
  await transport.sendMail({
    from: "no-reply@email.com",
    to: user.email,
    subject: "reset password",
    html: `<html>
    <body>
      <p>Click hee below to reset your password:</p>
      <a 
        href="http://localhost:5173/user/resetPswd/${resetToken}" 
        style="display:inline-block;padding:10px 15px;background-color:#007bff;
        color:white;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>
    </body>
  </html>`,
  });
  res.json({
    message: "Reset Link has been sent",
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const checktoken = jwt.verify(token, process.env.JWT);

    const user = await User.findOne({ _id: checktoken.id });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.resetToken !== token) {
      return res.status(400).json({ message: "Token mismatch" });
    }

    if (user.resetTknExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTknExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Welcome to dashboard", email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
