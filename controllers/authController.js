import User from "../models/userModel.js";
import generateToken from "../Utils/generateToken.js";
import createLog from "../Utils/logGenerator.js";

export const verifyLink = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verifyToken: token });

  if (!user) {
    return res.status(400).send(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Invalid or Expired Token</h2>
          <p>This verification link is no longer valid.</p>
        </body>
      </html>
    `);
  }

  res.send(`
    <html>
      <head>
        <title>Verify Account</title>
        <style>
          body { font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto; }
          form { border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
          input { width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box; }
          button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Verify Your Account</h2>
        <form action="/api/auth/verify" method="POST" onsubmit="submitForm(event)">
          <input type="hidden" name="token" value="${token}">
          <label for="password">Create a password:</label>
          <input type="password" id="password" name="password" required minlength="6">
          <button type="submit">Verify Account</button>
        </form>
        <script>
          async function submitForm(event) {
            event.preventDefault();
            const form = event.target;
            const token = form.elements['token'].value;
            const password = form.elements['password'].value;
            
            const response = await fetch('/api/auth/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, password })
            });
            
            const result = await response.json();
            if (response.ok) {
              document.body.innerHTML = '<h2>✓ Account Verified!</h2><p>' + result.msg + '</p>';
            } else {
              alert('Error: ' + result.msg);
            }
          }
        </script>
      </body>
    </html>
  `);
};

export const verifyUser = async (req, res) => {
  const { token, password } = req.body;

  if (!password) return res.status(400).json({ msg: "Password required" });

  const user = await User.findOne({ verifyToken: token });

  if (!user) return res.status(400).json({ msg: "Invalid token" });

  user.password = password;
  user.isVerified = true;
  user.verifyToken = null;

  await user.save();

  res.json({ msg: "Account activated" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified)
    return res.status(400).json({ msg: "Not verified" });

  const match = await user.comparePassword(password);

  if (!match) return res.status(400).json({ msg: "Invalid" });

  generateToken(user._id, res);

  await createLog(user._id, "LOGIN");

  res.json({ msg: "Logged in" });
};

export const logout = async (req, res) => {
  await createLog(req.user._id, "LOGOUT");

  res.clearCookie("token");

  res.json({ msg: "Logged out" });
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    // Check secret
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ msg: "Invalid admin secret" });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "ADMIN" });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ msg: "Admin already exists" });
    }

    // Check email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User exists" });
    }

    // Create admin
    const admin = await User.create({
      name,
      email,
      password,
      role: "ADMIN",
      isVerified: true,
    });

    await createLog(admin._id, "ADMIN CREATED");

    res.status(201).json({
      msg: "Admin registered",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

