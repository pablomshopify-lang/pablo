import type { Metadata } from 'next';
import { crearArtista } from '@/app/acciones';
import Aviso from '@/components/Aviso';
import CamposArtista from '@/components/CamposArtista';
import { colorEmpresa } from '@/components/Empresa';
import { empresas } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Nuevo artista' };

export default async function NuevoArtista({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; empresa?: string }>;
}) {
  const { error, empresa } = await searchParams;
  const lista = await empresas();
  return (
    <main className="wrap" style={{ maxWidth: '52rem' }}>
      <header className="cabeza">
        <div>
          <p className="eyebrow">Ingreso manual</p>
          <h1>Nuevo artista</h1>
        </div>
      </header>
      <p className="muted">
        Los artistas que llenan el formulario de ingreso aparecen solos. Usa
        esta página para sumar a alguien a mano (por ejemplo, un artista que ya
        trabaja con ustedes).
      </p>
      <Aviso error={error} />
      <form action={crearArtista} className="card form">
        <h2>¿Con qué empresas trabaja?</h2>
        <div className="grid">
          {lista.map((e) => (
            <label key={e.id} className="check" style={colorEmpresa(e)}>
              <input
                type="checkbox"
                name="empresas"
                value={e.id}
                defaultChecked={e.id === empresa}
              />
              {e.nombre}
            </label>
          ))}
        </div>
        <p className="muted">
          <small>
            Al guardar se crean solas las tareas del procedimiento de cada
            empresa, con sus plazos.
          </small>
        </p>
        <h2>Datos</h2>
        <CamposArtista />
        <div className="acciones">
          <button className="marca-btn">Guardar artista</button>
        </div>
      </form>
    </main>
  );
}
