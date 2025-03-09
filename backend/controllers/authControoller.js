


const login = (req, res) => {
    res.json({ message: 'Login successful' });
  };
  

  const register = (req, res) => {
    res.json({ message: 'Registration successful' });
  };
  

  module.exports = {
    login,
    register,
  };