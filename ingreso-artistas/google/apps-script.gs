/**
 * Holding MVCK · Ingreso de artistas
 *
 * Recibe cada inscripción de la web y:
 * 1) Agrega una fila en la hoja "Artistas" con todos sus datos.
 * 2) Agrega sus tareas en la hoja "Tareas" (con casilla para marcar hecho).
 * 3) Avisa por correo al equipo.
 *
 * Las hojas y sus títulos se crean solos la primera vez.
 */
const CORREO_EQUIPO = 'cambia-esto@tu-dominio.com'; // a quién avisar (puedes poner varios separados por coma)

const COLUMNAS_ARTISTAS = [
  ['id', 'ID'],
  ['fecha', 'Fecha'],
  ['nombre_artistico', 'Nombre artístico'],
  ['nombre_legal', 'Nombre legal'],
  ['documento', 'Documento'],
  ['nacimiento', 'Nacimiento'],
  ['email', 'Correo'],
  ['telefono', 'Teléfono'],
  ['pais', 'País'],
  ['ciudad', 'Ciudad'],
  ['tipo', 'Tipo'],
  ['genero', 'Género'],
  ['manager', 'Manager'],
  ['servicios', 'Servicios'],
  ['estado', 'Estado'],
  ['redes', 'Redes'],
  ['respuestas', 'Respuestas por servicio'],
  ['bio', 'Bio'],
  ['comentarios', 'Comentarios'],
];

const COLUMNAS_TAREAS = [
  'ID artista',
  'Artista',
  'Servicio',
  'Paso',
  'Tarea',
  'Departamento',
  'Responsable',
  'Vence',
  'Hecho',
  'Notas',
];

function hoja(nombre, titulos) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(nombre);
  if (!h) h = libro.insertSheet(nombre);
  if (h.getLastRow() === 0) {
    h.appendRow(titulos);
    h.getRange(1, 1, 1, titulos.length).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

const enLineas = (obj) =>
  Object.keys(obj || {})
    .filter((k) => obj[k])
    .map((k) => k + ': ' + obj[k])
    .join('\n');

function doPost(e) {
  const f = JSON.parse(e.postData.contents);
  f.estado = 'Nuevo';
  f.fecha = new Date(f.fecha);

  const artistas = hoja(
    'Artistas',
    COLUMNAS_ARTISTAS.map((c) => c[1]),
  );
  artistas.appendRow(
    COLUMNAS_ARTISTAS.map(([clave]) => {
      if (clave === 'redes' || clave === 'respuestas')
        return enLineas(f[clave]);
      return f[clave] || '';
    }),
  );

  const tareas = hoja('Tareas', COLUMNAS_TAREAS);
  const filas = (f.tareas || []).map((t) => [
    f.id,
    f.nombre_artistico,
    t.servicio,
    t.paso,
    t.tarea,
    t.area,
    t.responsable,
    new Date(t.vence + 'T12:00:00'),
    false,
    '',
  ]);
  if (filas.length) {
    const desde = tareas.getLastRow() + 1;
    tareas
      .getRange(desde, 1, filas.length, COLUMNAS_TAREAS.length)
      .setValues(filas);
    tareas.getRange(desde, 9, filas.length, 1).insertCheckboxes();
  }

  if (
    CORREO_EQUIPO.indexOf('@') > 0 &&
    CORREO_EQUIPO.indexOf('cambia-esto') < 0
  ) {
    MailApp.sendEmail({
      to: CORREO_EQUIPO,
      subject:
        'Nuevo artista: ' + f.nombre_artistico + ' (' + f.servicios + ')',
      body: [
        'Ingresó un artista nuevo: ' + f.nombre_artistico + ' · ' + f.id,
        'Servicios: ' + f.servicios,
        'Contacto: ' + f.email + ' · ' + f.telefono,
        '',
        'Se crearon ' + filas.length + ' tareas en la hoja:',
        SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join('\n'),
      name: 'Holding MVCK',
    });
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

/** Ejecuta esta función una vez a mano para dar permisos y ver una prueba. */
function probar() {
  doPost({
    postData: {
      contents: JSON.stringify({
        id: 'ART-PRUEBA',
        fecha: new Date().toISOString(),
        nombre_artistico: 'Artista de prueba',
        email: Session.getActiveUser().getEmail(),
        servicios: 'Mvck Music',
        redes: { instagram: '@prueba' },
        tareas: [
          {
            servicio: 'Mvck Music',
            paso: 1,
            tarea: 'Tarea de prueba',
            area: 'Dirección',
            responsable: 'Sebastián Biggio (CEO)',
            vence: '2026-12-01',
          },
        ],
      }),
    },
  });
}
