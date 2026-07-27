import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryPostsCountService,
} from "../services/category.service.js";

export const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const newCategory = await createCategoryService({ name, slug });
    return res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: {
          message: "Ya existe una categoría con ese nombre o slug",
        },
      });
    }
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const category = await getCategoryByIdService(id);
    if (!category) {
      return res.status(404).json({
        error: { message: "Categoría no encontrada" },
      });
    }

    const updatedCategory = await updateCategoryService(id, { name, slug });
    return res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: {
          message: "Ya existe una categoría con ese nombre o slug",
        },
      });
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await getCategoryByIdService(id);
    if (!category) {
      return res.status(404).json({
        error: { message: "Categoría no encontrada" },
      });
    }

    const postsCount = await getCategoryPostsCountService(id);
    if (postsCount > 0) {
      return res.status(409).json({
        error: {
          message: "No se puede eliminar una categoría con posts asociados",
        },
      });
    }

    await deleteCategoryService(id);
    return res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
