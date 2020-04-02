



# OmniStack 11.0 / Be The Hero

Application developed with Node.js (back-end), React (front-end) and React Native (mobile) during the Week Omnistack 11.0 provided by [RocketSeat](https://rocketseat.com.br/).

![logo](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/imgsite.PNG "Logo")

The application has two parts: a website and a mobile app.
The purpose is to register NGOs (Non-governmental organization) and publish incidents for users of the app to contact and make donations.

## [Back-end](#Back-end)
## [Front-end](#Front-end)
## [Mobile](#Mobile)
## [Tests](#Tests)

## Technologies

- Node.js 
- React
- React Native
- Expo
- SQLite
- Insomnia

<a name="Back-end"><a/>
	
# Back-end application

### Installed packages, frameworks and dependencies :

- **Express**;
- **Nodemon**;
- **Knex**;
- **Sqlite**;
- **Cors**;
- **Celebrate**.

# Back-end DOM

## Server.js folder
```
const app =  require('./app');
app.listen(3333);
```
Importing the folder "app.js" and creating a port to listen to the application.

## App.js folder

```
const express =  require('express');
const cors =  require('cors');
const { errors } =  require('celebrate');
const routes =  require('./routes');
const app =  express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports  = app;
```

Importing from their respective folders the express, cors, celebrate and routes.<br/>
And "app.use" is using the imported middlewares.

## Routes.js folder

```
const express =  require('express');
const { celebrate, Segments, Joi } =  require('celebrate');
const OngController =  require('./controllers/OngController');
const IncidentController =  require('./controllers/IncidentController');
const ProfileController =  require('./controllers/ProfileController');
const SessionController =  require('./controllers/SessionController');
const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngController.index);

routes.post('/ongs', celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		whatsapp: Joi.string().required().min(10).max(11),
		city: Joi.string().required(),
		uf: Joi.string().required().length(2),
	})
}), OngController.create);
 
routes.get('/profile', celebrate({
	[Segments.HEADERS]: Joi.object({
		authorization: Joi.string().required(),
	}).unknown(),
}), ProfileController.index);
 
routes.get('/incidents', celebrate({
	[Segments.QUERY]: Joi.object().keys({
		page: Joi.number(),
	})
}),IncidentController.index);

routes.post('/incidents', IncidentController.create);

routes.delete('/incidents/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	})
}), IncidentController.delete);

module.exports  = routes;
```
Importing the express again and importing the route controllers.<br/>
Creation of application routes.<br/>
The "sessions" route in the `POST`method for creating a login.<br/>
The "NGO" route in the `GET` method to list the NGOs created.<br/>
The "NGO" route in the `POST` method for creating NGOs in the application.<br/>
The "profile" route in the `GET` method to search for the NGO's profile when accessing the profile.<br/>
The "incidents" route in the `GET` method to search for incidents created in that profile.<br/>
The "incidents" route in the `POST` method to create the incidents in the NGO's profile.<br/>
And the "incidents /: id" route in the `DELETE` method to delete specific incidents in the NGO's profile.<br/>
Finally, exporting the routes.

## Database folder

### Migrations
```
exports.up  =  function(knex) {
	return knex.schema.createTable('ongs', function(table) {
		table.string('id').primary();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table.string('whatsapp').notNullable();
		table.string('city').notNullable();
		table.string('uf', 2).notNullable();
	});
};

exports.down  =  function(knex) {
	return knex.schema.dropTable('ongs');
};
```
Creation of the NGO table in the database.<br/>
Exports.up to create the table and exports.down to delete.

```
exports.up  =  function(knex) {
	return knex.schema.createTable('incidents', function(table) {
		table.increments();
		table.string('title').notNullable();
		table.string('description').notNullable();
		table.decimal('value').notNullable();
		table.string('ong_id').notNullable();
		table.foreign('ong_id').references('id').inTable('ongs');
	});
};

exports.down  =  function(knex) {
	return knex.schema.dropTable('incidents');
};
```
Creation of the Incidents table in the database.<br/>
Exports.up to create the table and exports.down to delete.<br/>
The `table.increments();` for creating auto-increment ID.<br/>
Foreign key relationships between the two tables.

### Connection

```
const knex =  require('knex');
const configuration =  require('../../knexfile');

const config =  process.env.NODE_ENV  ===  'test'  ? configuration.test : configuration.development;

const connection =  knex(config);
module.exports  = connection;
```
Importing the `knex` and connecting the database.<br/>
Checking if the database used is the development database or the test database.<br/>
In the end, exporting the connection.



