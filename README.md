# Octogon

An application that venture capital firms can use to better manage their portfolios.

# Useful commands
## Running MongoDB
The app will default to running through MongoLab, a cloud-based database service running on MongoDB. If you'd like to run the app on a local database rather than through MongoLab, follow the
### Running the App on MongoLab
1. Make sure that the link to the MongoLab database at `octogon/models/Company.js:12` is not commented out. It should look like this:
<pre>
var MONGO_URI = 'mongodb://heroku_app28713039:aa1jom2tna3p736qs2gglg2b2o@ds063899.mongolab.com:63899/heroku_app28713039'    ||    'mongodb://localhost/test';
</pre>

2. To manually change update the database, go to your [Heroku dashboard for Octogon](https://dashboard.heroku.com/apps/octogon-f8/resources) and under *Add-ons*, click *MongoLab*. Click on the collection that contains the document you wish to edit. Find that document within the collection and click the pencil-edit button to the right.
3. When editing a document, make sure to conform to the [standard JSON format](http://json.org/example).

### Running the App on a Local Database
go to `octogon/models/Company.js:12` and comment out the option to use the MongoLab database. It should look like this:
<pre>
var MONGO_URI = /* 'mongodb://heroku_app28713039:aa1jom2tna3p736qs2gglg2b2o@ds063899.mongolab.com:63899/heroku_app28713039'    ||    */ 'mongodb://localhost/test';
</pre>



`$ mongod --dbpath data` runs MongoDB

- There are several ways to run the application:
	- `$ node app.js` or `$ node app` runs the application. Each time a .js file is changed, you will have to restart the app.
	- `$ supervisor app.js` or `$ supervisor app` runs the application just as `node app`, but it also watches for changes and on a change restarts. To run this command, execute `$ npm install supervisor`.

- `$ grunt watch` watches for SASS changes

- `$ grunt cssmin` minifies your css file

- `$ grunt jslint` highlights JSLint errors

- `$ mocha` runs any tests