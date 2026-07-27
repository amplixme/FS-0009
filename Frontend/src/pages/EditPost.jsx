/**
 * Página de edición de un post.
 * Carga el post existente por ID y permite editarlo.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, update } from '../services/post.service';
import PostForm from '../components/PostForm';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/useAuth';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getById(id);
        if (user && user.id !== data.authorId) {
          setError('No tienes permiso para editar este artículo.');
          return;
        }
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      await update(id, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar el post');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" text="Cargando post..." />;
  }

  if (error && !post) {
    return <ErrorMessage message={error} />;
  }

  return (
    <PostForm
      initialData={post}
      onSubmit={handleSubmit}
      isLoading={isSaving}
      submitLabel="Actualizar artículo"
      serverError={saveError}
    />
  );
};

export default EditPost;
