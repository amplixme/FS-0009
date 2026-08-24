import { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../services/category.service';
import CategoryFormModal from '../components/CategoryFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [reloadKey, setReloadKey] = useState(0);

  const refreshCategories = () => setReloadKey((prev) => prev + 1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [reloadKey]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCategory(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormError(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      setIsSaving(true);
      setFormError(null);

      if (modalMode === 'edit') {
        await update(editingCategory.id, data);
        setToast({
          visible: true,
          message: 'Categoría actualizada correctamente',
          type: 'success',
        });
      } else {
        await create(data);
        setToast({ visible: true, message: 'Categoría creada correctamente', type: 'success' });
      }

      setModalOpen(false);
      refreshCategories();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await remove(deleteTarget.id);
      setToast({ visible: true, message: 'Categoría eliminada correctamente', type: 'success' });
      setDeleteTarget(null);
      refreshCategories();
    } catch (err) {
      setToast({ visible: true, message: err.message, type: 'error' });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-20 pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-on-surface tight-tracking">Categorías</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Nueva categoría
        </button>
      </div>

      {loading && <Spinner size="lg" text="Cargando categorías..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={refreshCategories} />}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          icon="label"
          message="Todavía no hay categorías."
          actionLabel="Crear primera categoría"
          onAction={openCreateModal}
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-6 py-4 ${
                index !== categories.length - 1 ? 'border-b border-outline-variant/20' : ''
              }`}
            >
              <div>
                <p className="font-semibold text-on-surface">{cat.name}</p>
                <p className="text-sm text-outline">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-4 py-2 rounded-full border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-error text-error text-sm font-semibold hover:bg-error-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        key={editingCategory?.id || 'create'}
        isOpen={modalOpen}
        mode={modalMode}
        initialData={editingCategory}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSaving={isSaving}
        serverError={formError}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Eliminar categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Categories;
