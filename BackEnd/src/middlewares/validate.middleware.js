export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errorMessages = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');

        const error = new Error(errorMessages);
        error.status = 400; 
        
        return next(error);
      }

      req.body = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
};