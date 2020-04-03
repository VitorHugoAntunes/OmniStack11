# OmniStack 11.0 / Be The Hero

Application developed with Node.js (back-end), React (front-end) and React Native (mobile) during the Week Omnistack 11.0 provided by [RocketSeat](https://rocketseat.com.br/).

![logo](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/imgsite.PNG "Logo")

The application has two parts: a website and a mobile app.
The purpose is to register NGOs (Non-governmental organization) and publish incidents for users of the app to contact and make donations.

- [Back-end](#Back-end)
- [Front-end](#Front-end)
- [Mobile](#Mobile)
- [Tests](#Tests)

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
Creation of application routes.<br/><br/>

The "sessions" route in the `POST` method for creating a login.<br/>
![Sessions](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoLogin.PNG "Sessions") <br/> <br/> 

The "NGO" route in the `GET` method to list the NGOs created.<br/>
![NgoList](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoOngList.PNG "NgoList") <br/> <br/> 

The "NGO" route in the `POST` method for creating NGOs in the application.<br/>
![NgoCreate](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoOngCreate.PNG "NgoCreate") <br/> <br/> 

The "profile" route in the `GET` method to search for the NGO's profile when accessing the profile.<br/>
![Profile](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoProfile.PNG "Profile") <br/> <br/> 

The "incidents" route in the `GET` method to search for incidents created in that profile.<br/>
![IncidentsList](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoListPage1.PNG "IncidentsList") <br/> <br/> 

The "incidents" route in the `POST` method to create the incidents in the NGO's profile.<br/>
![IncidentsCreate](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoIncidentCreate.PNG "InsoLogin")<br/>  
![IncidentsCreate2](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoIncidentCreate2.PNG "IncidentsCreate2")<br/> <br/> 

And the "incidents /: id" route in the `DELETE` method to delete specific incidents in the NGO's profile.<br/>
![IncidentsDelete](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoIncidentDelete.PNG "IncidentsDelete")<br/> <br/> 

And in the end, exporting the routes.

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

## Controllers folder

### NgoController

```
const generateUniqueId =  require('../utils/generateUniqueId');
const connection =  require('../database/connection');

module.exports  = {
	async  index(request, response) {
	const ongs =  await  connection('ongs').select('*');

	return response.json(ongs);
},

	async  create(request, response) {

		const { name, email, whatsapp, city, uf } = request.body;
		
		const id =  generateUniqueId();

		await  connection('ongs').insert({
			id,
			name,
			email,
			whatsapp,
			city,
			uf,
		})

		return response.json({ id });
	}
};
```

Import the unique ID of the NGO and the connection to the database.<br/>
Exports the function that returns the creation of the NGOs.<br/>
Async is used to wait for the connection with the NGO table and thus return all data.<br/>
Then, async is used to wait for the connection to the table to insert the data "id, name, email, whatsapp, city and uf", and finally to return the ID.

### IncidentController
```
const connection =  require('../database/connection');

module.exports  = {

async  index(request, response) {
	const { page =  1 } = request.query;
	const [count] =  await  connection('incidents').count();

	const incidents =  await  connection('incidents')
		.join('ongs', 'ongs.id', '=', 'incidents.ong_id')
		.limit(5)
		.offset((page -  1) *  5)
		.select(
			'incidents.*',
			'ongs.name',
			'ongs.email',
			'ongs.whatsapp',
			'ongs.city',
			'ongs.uf'
		);

		response.header('X-Total-Count', count['count(*)']);

		return response.json(incidents);

	},

	async  create(request, response) {
		const { title, description, value } = request.body;
		const ong_id = request.headers.authorization;

		const [id] =  await  connection('incidents').insert({
			title,
			description,
			value,
			ong_id,
		});

		return response.json({ id });
	},

	async  delete(request, response) {
		const { id } = request.params;
		const ong_id = request.headers.authorization;

 		const incident =  await  connection('incidents')
			.where('id', id)
			.select('ong_id')
			.first();

  

			if (incident.ong_id !== ong_id) {

			return response.status(401).json({ error:  'Operation not permitted.' });

			}

			await  connection('incidents').where('id', id).delete();

			return response.status(204).send();
	}
};
```

Importing the connection to the database.<br/>
Starting the page by requesting URL parameters (query params) with "page 1".<br/>
Waiting for the connection to the "incidents" table and counting how many elements are inserted.<br/>
Waiting for the connection to the table, checking if the two tables have the same "ong_id", limiting 5 elements to each page and defining an additional 5 for each next page.<br/>
Selecting all the specific NGO incidents and the fields in the NGO table.<br/>
Making the total count of the elements and returning the incidents.<br/>
Then, searching for the values of the incidents in the body of the request and checking if the "ong_id" is the same as the authorization of the header and thus creating the incidents with "title, description, value and ong_id" and finally returning the ID.<br/>
After all, to delete the incidents, checking if the "ong_id" is the same as "incident.ong_id", so that only the logged-in NGO can delete its incidents, if not, it returns `OPERATION NOT PERMITTED`.

### ProfileController
```
const connection =  require('../database/connection');

module.exports  = {
	async  index(request, response) {
		const ong_id = request.headers.authorization;
		
		const incidents =  await  connection('incidents')
			.where('ong_id', ong_id)
			.select('*');

			return response.json(incidents);
		}
}
```
Importing the database connection.<br/>
Exporting the function that returns all incidents to the NGO that is logged.

### SessionController
```
const connection =  require('../database/connection');

module.exports  = {
	async  create(request, response) {
		const { id } = request.body;
		const ong =  await  connection('ongs')
			.where('id', id)
			.select('name')
			.first();
			
		if (!ong) {

		return response.status(400).json({ error:  'No ONG found with this ID.'})
		}

	return response.json(ong);
	}
}
```
Importing the connection to the database.<br/>
Exporting the function that checks if the NGO ID exists to login the account and selects the name of that NGO.<br/>
If the NGO does not exist, it returns the error "NO NGO FOUND WITH THIS ID."

### Knexfile.js
```
development: {
	client:  'sqlite3',
	connection: {
		filename:  './src/database/db.sqlite'
	},
	migrations: {
		directory:  './src/database/migrations'
	},
	useNullAsDefault:  true,
},

test: {
	client:  'sqlite3',
	connection: {
		filename:  './src/database/test.sqlite'
	},
	migrations: {
		directory:  './src/database/migrations'
	},
	useNullAsDefault:  true,
},
```

Automatically generated file when you run `npm install knex`, and then run `npx knex init`.<br/>
The only changes were:
- Change the migration directory to `'./src/database/migrations'`;
- Create the test database.



