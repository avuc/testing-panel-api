'use strict';

const app = require('./server');
const mysql = app.dataSources.mysql;

// Obtener la lista de modelos
let models = Object.values(app.models)
  // Filtrar solo los modelos del datasource 'mysql'
  .filter(model => model.dataSource.name == 'mysql')
  // Obtener solo los nombres
  .map(model => model.name.replace('_', '-'))
  // Descartar repetidos
  .filter((model, index, self) => self.indexOf(model) == index);

// Autoupdate cada model
console.log('Autoupdating...');
models.reduce(async (prev, model) => {
  await prev;

  return new Promise(resolve => {
    mysql.isActual(model, function(err, actual) {
      if (err) throw err;

      // Si lo estan no hacer nada
      if (actual) {
        console.log(model + ' already up-to-date.');
        resolve();
        return;
      }

      // Si no, actualizar
      mysql.autoupdate(model, function(err) {
        if (err) throw err;

        console.log(model + ' updated.');
        resolve();
      });
    });
  });
}, Promise.resolve())

// Terminar
.then(() => mysql.disconnect());
