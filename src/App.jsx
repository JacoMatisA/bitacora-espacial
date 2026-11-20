import { useEffect, useState } from 'react'
import NoticiaCard from './components/NoticiaCard/NoticiaCard.jsx'

function App() {
  const [noticias, setNoticias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [termino, setTermino] = useState('')

  useEffect(() => {
    const controlador = new AbortController()
    const parametros = new URLSearchParams({ limit: '12' })

    if (termino) {
      parametros.set('search', termino)
    }

    async function cargarNoticias() {
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API_URL}/articles/?${parametros.toString()}`,
          { signal: controlador.signal },
        )

        if (!respuesta.ok) {
          throw new Error(`No se pudieron cargar las noticias (HTTP ${respuesta.status}).`)
        }

        const datos = await respuesta.json()
        setNoticias(datos.results)
      } catch (error) {
        if (!controlador.signal.aborted) {
          setError(error instanceof Error ? error.message : 'No se pudieron cargar las noticias.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarNoticias()
    return () => controlador.abort()
  }, [termino])

  function buscar(evento) {
    evento.preventDefault()
    const texto = new FormData(evento.currentTarget).get('q')
    const nuevoTermino = typeof texto === 'string' ? texto.trim() : ''

    if (nuevoTermino !== termino) {
      setCargando(true)
      setError(null)
      setTermino(nuevoTermino)
    }
  }

  return (
    <>
      <header className="contenedor cabecera">
        <p>Bitácora Espacial</p>
        <nav aria-label="Principal">
          <a href="#noticias">Noticias</a>
          <a href="#blogs">Blogs</a>
          <a href="#acerca">Acerca</a>
        </nav>
      </header>
      <main className="contenedor">
        <h1>Noticias espaciales</h1>
        <form className="buscador" onSubmit={buscar}>
          <label htmlFor="busqueda">Buscar por tema</label>
          <input
            id="busqueda"
            name="q"
            type="search"
            placeholder="Ej.: Mars, Artemis, SpaceX"
          />
          <button type="submit">Buscar</button>
        </form>
        <section aria-labelledby="ultimas-noticias" id="noticias">
          <h2 id="ultimas-noticias">Últimas noticias</h2>
          {cargando && <p role="status">Cargando noticias...</p>}
          {error && <p role="alert">{error}</p>}
          {!cargando && !error && noticias.length === 0 && (
            <p role="status">No hay noticias para "{termino}".</p>
          )}
          <div className="grid-noticias">
            {noticias.map((noticia) => (
              <NoticiaCard
                key={noticia.id}
                titulo={noticia.title}
                resumen={noticia.summary}
                imagen={noticia.image_url}
                fuente={noticia.news_site}
                fecha={noticia.published_at}
                enlace={noticia.url}
              />
            ))}
          </div>
        </section>
      </main>
      <footer className="contenedor">
        <p>Datos proporcionados por Spaceflight News API.</p>
      </footer>
    </>
  )
}

export default App
