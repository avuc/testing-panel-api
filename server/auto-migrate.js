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

// Automigrar cada model
console.log('Automigrating...');
models.reduce(async (prev, model) => {
  await prev;

  return new Promise(resolve => {
    mysql.automigrate(model, function(err) {
      if (err) throw err;

      console.log(model + ' migrated.');
      resolve();
    });
  });
}, Promise.resolve())

// Terminar
.then(() => mysql.disconnect());
