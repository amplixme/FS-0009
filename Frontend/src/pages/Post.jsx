/**
 * Página de creación de un post.
 * Usa PostForm como componente reutilizable.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../services/post.service";
import PostForm from "../components/PostForm";

export default function Post() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      const response = await create(formData);
      navigate(`/posts/${response.id}`);
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      isLoading={isSaving}
      submitLabel="Guardar artículo"
    />
  );
}