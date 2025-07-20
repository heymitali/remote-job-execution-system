const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
};

module.exports = {
  errorHandler
};
