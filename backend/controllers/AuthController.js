const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario (la contraseña se encripta automáticamente en el modelo)
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generar token JWT con la misma estructura que loginUser
    const payload = {
      user: {
        id: newUser._id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          token, 
          user: { 
            id: newUser._id, 
            name: newUser.name, 
            email: newUser.email 
          } 
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }
    
    // Crear payload para el JWT
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Generar el token JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }, // Tiempo de expiración
      (err, token) => {
        if (err) throw err;
        // Devolver el token generado al cliente
        res.json({ 
          message: 'Login exitoso',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const verifyUser = async (req, res) => {
  try {
    // req.user se agrega desde el middleware verifyJWT
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  register,
  loginUser,
  verifyUser
};
