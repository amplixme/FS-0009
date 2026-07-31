import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import Categories from "./pages/Categories";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

          <Route path="/post" element={
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;