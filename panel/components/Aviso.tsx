/** Mensaje arriba de la página después de guardar (?ok=1) o de un error (?error=…). */
export default function Aviso({
  error,
  ok,
  textoOk = 'Cambios guardados.',
}: {
  error?: string;
  ok?: string;
  textoOk?: string;
}) {
  if (error) return <p className="aviso error">{error}</p>;
  if (ok) return <p className="aviso bien">{textoOk}</p>;
  return null;
}
