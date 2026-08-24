import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostCard from './PostCard'

const mockPost = {
  id: 1,
  title: 'Cómo aprender React en 2026',
  content: 'React sigue siendo una de las librerías más usadas para construir interfaces de usuario modernas y reactivas.',
  createdAt: new Date().toISOString(),
  coverImage: null,
  author: { name: 'Fiamma Torres' },
  categories: [],
  _count: { comments: 5 },
}

const renderPostCard = (post = mockPost) => {
  render(
    <MemoryRouter>
      <PostCard post={post} />
    </MemoryRouter>
  )
}

describe('PostCard', () => {
  it('renderiza el título del post', () => {
    renderPostCard()
    expect(screen.getByText('Cómo aprender React en 2026')).toBeInTheDocument()
  })

  it('renderiza el nombre del autor', () => {
    renderPostCard()
    expect(screen.getByText('Fiamma Torres')).toBeInTheDocument()
  })

  it('renderiza el extracto (contenido) del post', () => {
    renderPostCard()
    expect(
      screen.getByText(/React sigue siendo una de las librerías/i)
    ).toBeInTheDocument()
  })

  it('muestra "Autor desconocido" cuando el post no tiene autor', () => {
    const postSinAutor = { ...mockPost, author: null }
    renderPostCard(postSinAutor)
    expect(screen.getByText('Autor desconocido')).toBeInTheDocument()
  })

  it('renderiza la cantidad de comentarios', () => {
    renderPostCard()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})