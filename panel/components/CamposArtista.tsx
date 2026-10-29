import type { Artista, CampoTexto } from '@/lib/datos';
import { REDES, TIPOS_ARTISTA } from '@/lib/datos';

const CAMPOS: {
  id: CampoTexto;
  label: string;
  tipo?: string;
  requerido?: boolean;
}[] = [
  { id: 'nombre_artistico', label: 'Nombre artístico', requerido: true },
  { id: 'nombre_legal', label: 'Nombre legal completo' },
  { id: 'documento', label: 'RUT / documento' },
  { id: 'nacimiento', label: 'Fecha de nacimiento', tipo: 'date' },
  { id: 'email', label: 'Correo', tipo: 'email' },
  { id: 'telefono', label: 'Teléfono / WhatsApp', tipo: 'tel' },
  { id: 'pais', label: 'País' },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'genero', label: 'Género musical' },
  { id: 'manager', label: 'Manager (nombre y contacto)' },
];

/** Datos y redes del artista: los usan «Nuevo artista» y «Editar ficha». */
export default function CamposArtista({ artista }: { artista?: Artista }) {
  return (
    <>
      <div className="grid">
        {CAMPOS.map((c) => (
          <label key={c.id} className="campo">
            {c.label}
            {c.requerido && ' *'}
            <input
              name={c.id}
              type={c.tipo ?? 'text'}
              required={c.requerido}
              defaultValue={artista?.[c.id] ?? ''}
            />
          </label>
        ))}
        <label className="campo">
          Tipo
          <select name="tipo" defaultValue={artista?.tipo ?? ''}>
            <option value="">—</option>
            {TIPOS_ARTISTA.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          Regalías cada (meses)
          <input
            name="regalias_meses"
            type="number"
            min={1}
            max={24}
            defaultValue={artista?.regalias_meses ?? ''}
            placeholder="Según Plazos"
          />
        </label>
        <label className="campo ancho">
          Biografía corta
          <textarea name="bio" defaultValue={artista?.bio ?? ''} />
        </label>
      </div>
      <details open={!artista}>
        <summary>Redes y links ▾</summary>
        <div className="grid">
          {REDES.map((r) => (
            <label key={r.id} className="campo">
              {r.label}
              <input
                name={`red_${r.id}`}
                defaultValue={artista?.redes?.[r.id] ?? ''}
              />
            </label>
          ))}
        </div>
      </details>
    </>
  );
}
