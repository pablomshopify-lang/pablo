import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <main className="wrap">
      <h1>No encontramos esa página</h1>
      <p>
        <Link href="/artistas">Volver a artistas</Link>
      </p>
    </main>
  );
}
