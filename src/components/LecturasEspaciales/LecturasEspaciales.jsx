import { useState } from "react";
import NoticiaCard from "../NoticiaCard/NoticiaCard.jsx";

export default function LecturasEspaciales({ noticias, mostrarGuia = false }) {
  const [guardadas, setGuardadas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [antes, setAntes] = useState([]);
  const [operacion, setOperacion] = useState("useState([])");

  function guardarNoticia(noticia) {
    setAntes(guardadas.map((item) => item.id));
    setOperacion(`guardarNoticia(noticia) · id: ${noticia.id}`);
    setGuardadas((actuales) =>
      actuales.some((item) => item.id === noticia.id)
        ? actuales
        : [...actuales, noticia],
    );
    setMensaje(`Guardada: ${noticia.title}`);
  }

  function quitarNoticia(id) {
    setAntes(guardadas.map((item) => item.id));
    setOperacion(`quitarNoticia(${id}) · filter`);
    setGuardadas((actuales) => actuales.filter((item) => item.id !== id));
    setMensaje("Noticia retirada de Mi próxima lectura.");
  }

  function tarjeta(noticia, guardada) {
    const yaGuardada = guardadas.some((item) => item.id === noticia.id);
    return (
      <NoticiaCard
        key={noticia.id}
        titulo={noticia.title}
        resumen={noticia.summary}
        imagen={noticia.image_url}
        fuente={noticia.news_site}
        fecha={noticia.published_at}
        enlace={noticia.url}
        textoAccion={
          guardada
            ? "Quitar de mi lista"
            : yaGuardada
              ? "Guardada"
              : "Guardar para después"
        }
        deshabilitada={!guardada && yaGuardada}
        onAccion={() =>
          guardada ? quitarNoticia(noticia.id) : guardarNoticia(noticia)
        }
      />
    );
  }

  return (
    <div className="lecturas-espaciales">
      <p role="status">{mensaje || "Elige una noticia para guardar."}</p>
      <div className={mostrarGuia ? "lecturas-comparacion" : undefined}>
        <section aria-labelledby="lecturas-disponibles">
          <h2 id="lecturas-disponibles">Noticias disponibles</h2>
          {mostrarGuia && (
            <p className="lecturas-prop">
              <code>textoAccion="Guardar para después"</code>
            </p>
          )}
          <div className="grid-noticias">
            {noticias.map((noticia) => tarjeta(noticia, false))}
          </div>
        </section>
        <section aria-labelledby="lecturas-guardadas">
          <h2 id="lecturas-guardadas">
            Mi próxima lectura ({guardadas.length})
          </h2>
          {mostrarGuia && (
            <p className="lecturas-prop">
              <code>textoAccion="Quitar de mi lista"</code>
            </p>
          )}
          {guardadas.length === 0 && (
            <p>
              Todavía no tienes noticias guardadas. Elige una de las noticias
              disponibles.
            </p>
          )}
          <div className="grid-noticias">
            {guardadas.map((noticia) => tarjeta(noticia, true))}
          </div>
        </section>
      </div>
      <details>
        <summary>Inspeccionar los identificadores guardados</summary>
        <pre>{JSON.stringify(guardadas.map((noticia) => noticia.id))}</pre>
      </details>
    </div>
  );
}
