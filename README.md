




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

To start the back-end server, run `npm start`.

### Installed packages, frameworks and dependencies :

- **Express**;
- **Nodemon**;
- **Knex**;
- **Sqlite**;
- **Cors**;
- **Celebrate**.

# Back-end DOM

## Server.js
```
const app =  require('./app');
app.listen(3333);
```
Importing the folder "app.js" and creating a port to listen to the application.

## App.js

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

## Routes.js

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

The "sessions" route in the `POST` method for creating a login.<br/><br/>
![Sessions](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoLogin.PNG "Sessions") <br/> <br/> 

The "NGO" route in the `GET` method to list the NGOs created.<br/><br/>
![NgoList](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoOngList.PNG "NgoList") <br/> <br/> 

The "NGO" route in the `POST` method for creating NGOs in the application.<br/><br/>
![NgoCreate](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoOngCreate.PNG "NgoCreate") <br/> <br/> 

The "profile" route in the `GET` method to search for the NGO's profile when accessing the profile.<br/><br/>
![Profile](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoProfile.PNG "Profile") <br/> <br/> 

The "incidents" route in the `GET` method to search for incidents created in that profile.<br/><br/>
![IncidentsList](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoListPage1.PNG "IncidentsList") <br/> <br/> 

The "incidents" route in the `POST` method to create the incidents in the NGO's profile.<br/><br/>
![IncidentsCreate](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoIncidentCreate.PNG "InsoLogin")<br/>  
![IncidentsCreate2](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/InsoIncidentCreate2.PNG "IncidentsCreate2")<br/> <br/> 

And the "incidents /: id" route in the `DELETE` method to delete specific incidents in the NGO's profile, returns status 204 if successful.<br/><br/>
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


<a name="Front-end"><a/>
	
# Front-end application

Now, outside the back-end directory, the front-end project was created by running `npx create-react-app frontend`.<br/>
To start the front-end server, run `npm start`.

### Installed packages, frameworks and dependencies :

- **React-icons**;
- **React-router-dom**;
- **Axios**.

# Front-end DOM

### Routes.js
```
import React from  'react';
import { BrowserRouter, Route, Switch } from  'react-router-dom';

import Logon from  './pages/logon';
import Register from  './pages/Register';
import Profile from  './pages/Profile';
import NewIncident from  './pages/NewIncident';

export  default  function  Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route  path="/"  exact  component={Logon}/>
				<Route  path="/register"  component={Register}/>
				<Route  path="/profile"  component={Profile}/>
				<Route  path="/incidents/new"  component={NewIncident}/>
			</Switch>
		</BrowserRouter>
	);
}
```
Importing React from inside the react folder.<br/>
Importing BrowserRouter, Switch and Route components from the react-router-dom folder.<br/>
Importing the Logon, Register, Profile and NewIncident pages from their respective folders.<br/>
Exporting in JSX format the function that creates a route for each page.<br/>
The `BrowserRouter` informs the components of the routes and the `Switch` avoids calling more than one route at the same time.<br/>

### App.js

```
import React from  'react';
import  './global.css'

import Routes from  './routes';

function  App() {
	return (
		<Routes/>
	);
}

export  default App;
```
Importing React from inside the react folder.<br/>
Importing css styles from global css folder.<br/>
Importing Routes from global routes folder.<br/>
Function that renders the components of the routes in the `App`.<br/>

### Index.js
```
import React from  'react';
import ReactDOM from  'react-dom';
import App from  './App';

ReactDOM.render(<App  />, document.getElementById('root'));
```
Importing React from inside the react folder.<br/>
Importing ReactDom from the react-dom folder.<br/>
Importing Routes from the App folder.<br/>
Render App elements in a div "root".<br/>

### Services folder (api.js)
```
import axios from  'axios';

const api = axios.create({
	baseURL:  'http://localhost:3333',
})

export  default api;
```
Importing axios from axios folder.<br/>
Creating a constant variable to store the api of port 3333 (back-end connection).<br/>
Exportando a api.

# Pages folder

## Logon

### Index.js
```
import React, { useState } from  'react';
import { Link, useHistory} from  'react-router-dom';
import { FiLogIn } from  'react-icons/fi';

import  './styles.css';

import heroesImg from  '../../assets/heroes.png';
import logoImg from  '../../assets/logo.svg';
import api from  '../../services/api';

export  default  function  Logon(){
	const [id, setId] =  useState('');

	const history = useHistory();
	
	async function handleLogin(e) {
		e.preventDefault();

		try {
			const response = await api.post('sessions', { id });
 
			localStorage.setItem('ongId', id);
			localStorage.setItem('ongName', response.data.name);

			history.push('/profile');

		} catch (err) {
			alert('Falha no login, tente novamente.')
		}
	}
	
	return (

		<div  className="logon-container">
			<section  className="form">
				<img  src={logoImg}  alt="Be The Heros"/>

				<form  onSubmit={handleLogin}>
					<h1>Faça seu logon</h1>

					<input
					placeholder="Sua ID"
					value={id}
					onChange={e  =>  setId(e.target.value)}
					/>

					<button
					className="button"
					type="submit">Entrar</button>

					<Link  className="Back-link"  to="/register">
					<FiLogIn  size={16}  color="#E02041"/>
					Não tenho cadastro
					</Link>
				</form>
			</section>

			<img  src={heroesImg}  alt="Heroes"/>
		</div>
	);

}
```
Importing React and useState resource from react folder.<br/>
Importing the Link component and useHistory from the react-router-dom folder.<br/>
Importing the Login icon from the react-icons folder.<br/>
Importing css styles from the styles.css folder.<br/>
Importing the Heroes image and the Logo from the assets folder.<br/>
Importing the api from api folder.<br/>
Exporting the login function.<br/>
Armazenando o ID da variável e não alterando-o diretamente.<br/>
Storing the variable `ID` and not changing it directly.<br/>
Storing useHistory with the variable `history`.<br/>
Async function that sends the login.<br/>
Preventing the default behavior of onSubmit to not send to another page.<br/>
Waiting for the API response to verify that the NGO ID and name are compatible to send to the profile page using `history`, otherwise, send an error message.<br/>
Returning the page's HTML.<br/>
Creating a `div` to be the container with the elements of the form.<br/>
Adding the logo image.<br/>
Creating the form with the Login function, there is a title, an input to get the ID value, a button to send the data, a link for the user to register and the link icon.<br/>

### Styles.css
```
.logon-container {
	width:  100%;
	max-width:  1120px;
	height:  100vh;
	margin:  0  auto;

display:  flex;
	align-items:  center;
	justify-content:  space-between;
}

.logon-container section.form {
	width:  100%;
	max-width:  350px;
	margin-right:  30px;
}

.logon-container section.form form {
	margin-top:  100px;
}

.logon-container section.form form h1 {
	font-size:  32px;
	margin-bottom:  32px;
}
```
Defining the height and width of the container and aligning the elements to the center and giving a space between them.<br/>
Defining the width, height and margin of the form.<br/>
Changing the title size and margin.<br/>

### The result of this page's code:

![loginPage](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/LoginPage.PNG "loginPage")

## Register

### Index.js

```
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();
        
        const data = {
            name,
            email,
            whatsapp,
            city,
            uf,
        };

       try {
            const response = await api.post('ongs', data);

            alert(`Seu ID de acesso: ${response.data.id}`);

            history.push('/');
       } catch (err) {
           alert('Erro no cadastro, tente novamente.');
       }
    }

    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be The Hero"/>

                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos da sua ONG.</p>

                    <Link className="Back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar para a home
                    </Link>
                </section>

                <form onSubmit={handleRegister}>
                    <input 
                        placeholder="Nome da ONG"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <input 
                        type="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input 
                        placeholder="WhatsApp"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                    />

                    <div className="input-group">
                        <input 
                            placeholder="Cidade"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />

                        <input 
                            placeholder="UF" 
                            style={{ width: 80 }}
                            value={uf}
                            onChange={e => setUf(e.target.value)}
                        />
                    </div>

                    <button className="button" type="submit"> Cadastrar </button>
                </form>
            </div>
        </div>
    )
}
```
Importing React and useState from the react folder.<br/>
Importing the Link and useHistory from the react-router-dom folder.<br/>
Importing the left arrow icon from the react-icons folder.<br/>
Importing the API from the services folder.<br/>
Importing styles.<br/>
Importing the logo from the assets folder.<br/>
Exporting the function that creates the Register page.<br/>
Creating the name, email, whatsapp, city and uf variables using useState to not change their values directly.<br/>
Storing useHistory with the variable `history`.<br/>
Async function that sends the Register.<br/>
Preventing the default behavior of onSubmit to not send to another page.<br/>
Creating an object in the Data variable with the data of name, email, whatsapp, city and uf.<br/>
Waiting for waiting for the api to send the data to the NGO table and showing an alert with the created ID, after that sending the user to the Login home page.<br/>
If there are errors in the registration, a message is sent to the user.<br/>
Returns the HTML elements of the Register page.<br/>
A div was created to encapsulate the elements of the NGO registration form.<br/>
Session with the logo, a title, a paragraph about the registration and a link to return to the Login page with the left arrow icon.<br/>
Form that when sent activates the function of sending the Register.<br/>
The form contains inputs to get the name, email, whatsapp, city and UF values of the NGOs and a button to send all data.


### Styles.css
```
.register-container {
    width: 100%;
    max-width: 1120px;
    height: 100vh;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
}

.register-container .content {
    width: 100%;
    padding: 96px;
    background: #f0f0f5;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    display: flex;
    justify-content: space-between;
    align-items: center;
} 

.register-container .content section {
    width: 100%;
    max-width: 380px;
}

.register-container .content section h1 {
    margin: 64px 0 32px;
    font-size: 32px; 
}

.register-container .content section p {
    font-size: 18px;
    color: #737380;
    line-height:  32px;
}

.register-container .content form {
    width: 100%;
    max-width: 450px;
}

.register-container .content form input {
    margin-top: 8px;
}

.register-container .content form .input-group {
    display: flex;
}

.register-container .content form .input-group input + input {
    margin-left: 8px;
}
```
Defining height, width, margin and aligning the registration form container to the center.<br/>
Stylizing and reorganizing the section of the title and paragraph and then organizing and styling the inputs on the left side of the session.

### The result of this page's code:

![registerPage](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/RegisterPage.PNG "registerPage")


## Profile

### Index.js

```
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Profile() {

    const [incidents, setIncidents] = useState([]);
    
    const history = useHistory()

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente.')
        }
    }

    function handleLogout(){
        localStorage.clear();

        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
            <span>Bem vinda, {ongName}</span>

                <Link className="button" to="incidents/new">Cadastrar novo caso</Link>

                <button onClick={handleLogout} type="button">
                    <FiPower size="18" color="#E02041"/>
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>


                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```
Importing React, useState and useEffect from the react folder.<br/>
Importing the Link and useHistory from the react-router-dom folder.<br/>
Importing the icons.<br/>
Importing the API.<br/>
Importing styles and Logo.<br/>
Exporting the function that stores the elements of the NGO profile page.<br/>
Storing the variable `incidents` and not changing it directly using useState.<br/>
Storing useHistory with the variable `history`.<br/>
Search the localStorage for the name and ongID of the NGO and store it in variables.<br/>
Function that searches for the NGO ID and stores the incident data in the variable setIncidents.<br/>
Async function that deletes the incidents, awaits the API response to delete the incidents by ID according to the NGO's ongID logged in.<br/>
When trying to delete, make a filter to confirm that the IDs are the same, if not, an error message is sent.<br/>
Logout function, clears localStorage and sends the user back to the Login page.<br/>
Returns the HTML elements of the page.<br/>
A header with the logo, a welcome message with the name of the NGO logged in, a button to register new incidents and a button to Logout.<br/>
Below, a title and a list of all registered incidents, all with a unique key that is the incident ID (uniquely identify them and exclude only one and not all).<br/>
Filling the paragraphs with the incident data (title, description and value) and formatting the value with the Brazilian currency and lastly, a button with Trash icon that activates the function to delete incidents.

### Styles.css
```
.profile-container {
    width: 100%;
    max-width: 1180px;
    padding: 0 30px;
    margin: 32px auto;
}

.profile-container header {
    display: flex;
    align-items: center;
}

.profile-container header span {
    font-size: 20px;
    margin-left: 24px;
}


.profile-container header img {
    height: 64px;
}

.profile-container header a {
    width: 260px;
    margin-left: auto;
    margin-top: 0;
}

.profile-container header button {
    height: 60px;
    width: 60px;
    border-radius: 4px;
    border: 1px solid #dcdce6;
    background: transparent;
    margin-left: 16px;
    transition: border-color 0.2s;
}

.profile-container header button:hover {
    border-color: #999;
}

.profile-container h1 {
    margin-top: 80px;
    margin-bottom: 24px;
}

.profile-container ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
    list-style: none;
}

.profile-container ul li {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    position: relative;
}

.profile-container ul li button {
    position: absolute;
    right: 24px;
    top: 24px;
    border: 0px;
    background-color: white;
}

.profile-container ul li button:hover {
    opacity: 0.8;
}

.profile-container ul li strong {
    display: block;
    margin-bottom: 16px;
    color: #41414d;
}

.profile-container ul li p + strong {
    margin-top: 32px;
}

.profile-container ul li p {
    color: #737380;
    line-height: 21px;
    font-size: 16px;
}
```
Rearranging the position and size of the main container of the page and the elements of the header.<br/>
Stylizing and rearranging all elements of the list of incidents such as position, colors, size and margin of paragraphs and buttons.

### The result of this page's code: 

![profilePage](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/ProfilePage.PNGa "profilePage")

## NewIncident

### Indes.js
```
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function NewIncident(){

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');

    const history = useHistory();

    const ongId = localStorage.getItem('ongId')

    async function handleNewIncident(e) {
        e.preventDefault();

        const data = {
            title,
            description,
            value,
        };

        try {
            await api.post('incidents', data, {
                headers: {
                    Authorization: ongId,
                }
            })

            history.push('/profile');
        } catch (err) {
            alert('Erro ao cadastrar caso, tente novamente.');
        }
    }

    return (
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be The Hero"/>

                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>

                    <Link className="Back-link" to="/profile">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar
                    </Link>
                </section>

                <form onSubmit={handleNewIncident}>
                    <input 
                        placeholder="Título do caso"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        />
                    <textarea 
                        placeholder="Descrição"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        />
                    <input   
                        placeholder="Valor em reais"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        />
                    <button className="button" type="submit"> Cadastrar </button>
                </form>
            </div>
        </div>
    );
}
```
Importing React and useState from the react folder.<br/>
Importing Link and useHistory from the react-router-dom folder and the left arrow icon from the react-icons folder.<br/>
Importing the API from the services folder.<br/>
Importing the logo from the assets folder.<br/>
Exporting the function that creates a new incident.<br/>
Creating the title, description and value variables and other `set` variables and not changing the state of the variables directly.<br/>
Storing useHistory with the variable `history`.<br/>
Search the localStorage for the name and ongID of the NGO and store it in variable.<br/>
Async function that sends the creation data of the new incident.<br/>
Preventing the default behavior of onSubmit to not send to another page.<br/>
Creating an object with title, description and value data.<br/>
Waiting for the api to send the data to the incident table and checking the authorization of the header to send the user back to the profile page. If it fails, show an error alert about the registration.<br/>
Returning the HTML elements of the page.<br/>
A session was created to attach the logo, the title and a paragraph explaining the registration and a link to return to the profile page.<br/>
Form that, when sent, activates the function that creates the new incident.<br/>
Inputs were created that receive the title value, description and value of the incidents.

### Styles.css
```
.new-incident-container {
    width: 100%;
    max-width: 1120px;
    height: 100vh;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
}

.new-incident-container .content {
    width: 100%;
    padding: 96px;
    background: #f0f0f5;
    
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    display: flex;
    justify-content: space-between;
    align-items: center;
} 

.new-incident-container .content section {
    width: 100%;
    max-width: 380px;
}

.new-incident-container .content section h1 {
    margin: 64px 0 32px;
    font-size: 32px; 
}

.new-incident-container .content section p {
    font-size: 18px;
    color: #737380;
    line-height:  32px;
}

.new-incident-container .content form {
    width: 100%;
    max-width: 450px;
}

.new-incident-container .content form input,
.new-incident-container .content form textarea {
    margin-top: 8px;
}
```
Defining margin, width, height and alignment of the main container.<br/>
Organizing the contents of the container.<br/>
Stylizing the container session.<br/>
Defining the width and size of the form and the inputs and textareas.

### The result of this page's code: 

![NewIncidentPage](https://github.com/VitorHugoAntunes/OmniStack11/blob/master/images/NewIncidentPage.PNG "NewIncidentPage")
