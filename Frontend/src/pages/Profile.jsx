import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getAll } from '../services/post.service';
import userService from '../services/user.service';
import PostCard from '../components/PostCard';
import Spinner from '../components/common/Spinner'
import ProfileFormModal from '../components/ProfileFormModal';
import { AuthContext } from '../context/AuthContextInstance';

const Profile = () => {
  const { user: currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {

    const getProfile = async () => {
      try {
        await userService.getProfile(id).then(data => {
          setProfile(data)
        });
      } catch (error) {
        setError(error.message);
      }
    }
    getProfile();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile) return;
      try {
        setLoadingPosts(true);
        setError(null);

        const response = await getAll({ limit: 100 });
        const userPosts = response.data.filter(post => post.author.id === profile.id);
        setPosts(userPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [profile]);


  const updateProfile = async (data) => {
    try {
      setIsEditing(true);
      setEditError(null);
      await userService.updateProfile(data)
      setEditTarget(null);
      const updatedData = await userService.getProfile(id);
      setProfile(updatedData);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditing(false);
    }
  };

  if (error) return <div className="pt-32 text-center text-error">{error}</div>;

  if (!profile) return <Spinner size="lg" text="Cargando perfil..." />;

  const isOwnProfile = !!(currentUser && profile && String(currentUser.id) === String(profile.id));

  return (
    <>
      <section className="max-w-[900px] mx-auto mb-12">
        <div className="bg-surface-container-lowest rounded-[16px] p-8 md:p-12 shadow-[0_20px_40px_rgba(17,24,39,0.05)] flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
          {/* Avatar del usuario*/}
          <div className="relative flex-shrink-0">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-surface-container-low">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-grow text-center md:text-left space-y-4">
            <div>
              <h1 className="text-[28px] font-extrabold text-on-surface tracking-tight">{profile.name}</h1>
              <p className="text-[1.125rem] text-on-surface-variant font-medium mt-1">{profile.bio}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Miembro desde {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Lógica de visualización del botón Editar Perfil*/}
            {isOwnProfile && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setEditError(null);
                    setEditTarget(profile);
                  }}
                  className="px-6 py-2.5 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all"
                >
                  Editar perfil
                </button>
              </div>
            )}
          </div>
        </div>

        {/* <!-- Tabs Navigation --> */}
        <section className="max-w-[900px] mx-auto mb-10 border-b border-surface-container-highest flex gap-8">
          <button className="pb-4 text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400">
            Publicaciones
          </button>
          <button className="pb-4 text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 transition-colors">
            Comentarios
          </button>
        </section>
        
        {loadingPosts ? (
          <Spinner size="lg" text="Cargando publicaciones..." />
        ) : posts.length === 0 ? (
          <div className="max-w-[900px] mx-auto text-center py-16 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant">
            <p className="text-on-surface-variant font-medium text-lg">
              Este usuario aún no ha publicado nada.
            </p>
          </div>
        ) : (
          <section className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </section>

      <ProfileFormModal
        key={editTarget ? `edit-${editTarget.id}` : "edit-closed"}
        isOpen={Boolean(editTarget)}
        mode="edit"
        initialData={editTarget}
        onSubmit={updateProfile}
        onCancel={() => setEditTarget(null)}
        isSubmitting={isEditing}
        error={editError}
      />
    </>
  )
}

export default Profile;