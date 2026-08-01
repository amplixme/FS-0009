import { uploadImageService } from "../services/upload.service.js";

export const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { message: "No se envió ninguna imagen" },
      });
    }

    const url = await uploadImageService(req.file);

    return res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};
