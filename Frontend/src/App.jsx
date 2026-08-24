import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Spinner from './components/common/Spinner';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Post = lazy(() => import('./pages/Post'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Categories = lazy(() => import('./pages/Categories'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<Spinner size="lg" text="Cargando página..." />}>
            <Routes>
              {/* Header + Footer del sitio */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              {/* Rutas de auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                }
              />

              {/* Detalle de post - ruta publica con Layout */}
              <Route
                path="/posts/:id"
                element={
                  <Layout>
                    <PostDetail />
                  </Layout>
                }
              />

              {/* Editar post - ruta protegida */}
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />

              {/* Gestión de categorías - ruta protegida */}
              <Route
                path="/categorias"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />

              {/* Gestión de Perfil - Ruta pública */}
              <Route
                path="/profile/:id"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />

              {/* Panel de administración - ruta protegida (solo ADMIN) */}
              <Route
                path="/admin"
                element={
                  <Layout>
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  </Layout>
                }
              />

              {/* Ruta catch-all para 404 */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFound />
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
