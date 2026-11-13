/**
 * Vitis Digital · Guardar contactos de los regalos en Google Sheets
 *
 * Cómo instalarlo (una sola vez):
 * 1. Creá una hoja de Google Sheets nueva (por ejemplo "Contactos web Vitis").
 * 2. En la hoja: Extensiones > Apps Script. Borrá lo que aparece y pegá todo este archivo.
 * 3. Guardá y tocá Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 4. Copiá la URL que termina en /exec y pegala en js/main.js, en CONFIG.leadsEndpoint.
 */
function doPost(e) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(['Fecha', 'Tipo', 'Contacto', 'Recurso descargado', 'Página']);
    hoja.setFrozenRows(1);
  }
  var p = (e && e.parameter) || {};
  var limpiar = function (v) { return String(v || '').replace(/^[=+\-@]/, "'$&").slice(0, 200); };
  hoja.appendRow([new Date(), limpiar(p.tipo), limpiar(p.contacto), limpiar(p.recurso), limpiar(p.pagina)]);
  return ContentService.createTextOutput('ok');
}
