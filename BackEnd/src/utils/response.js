export const success = (res, data, status = 200) => {
  return res.status(status).json({
    error: null,
    data
  });
};

export const error = (res, message, status = 500) => {
  return res.status(status).json({
    error: {
      message,
      status
    }
  });
};