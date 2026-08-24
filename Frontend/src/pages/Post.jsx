/**
 * Página de creación de un post.
 * Usa PostForm como componente reutilizable.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from '../services/post.service';
import PostForm from '../components/PostForm';

export default function Post() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      setError(null);
      const response = await create(formData);
      navigate(`/posts/${response.id}`);
    } catch (err) {
      setError(err.message || 'Error al guardar el artículo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      isLoading={isSaving}
      submitLabel="Guardar artículo"
      serverError={error}
    />
  );
}
