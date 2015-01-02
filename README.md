# Octogon

An application that venture capital firms can use to better manage their portfolios.

# Useful commands
## Running the Database with MongoDB
The app will default to running through MongoLab, a cloud-based database service running on MongoDB. You may also run the app on a local database rather than through MongoLab.

### Running the Database on MongoLab
1. Make sure that the link to the MongoLab database at `octogon/models/Company.js:12` is not commented out. It should look like this:
```javascript
var MONGO_URI = process.env['OCTAGON_MONGO_URI']   ||    'mongodb://localhost/test';
```

2. To manually change update the database, go to your [Heroku dashboard for Octogon](https://dashboard.heroku.com/apps/octogon-f8/resources) and under *Add-ons*, click *MongoLab*. Click on the collection that contains the document you wish to edit. Find that document within the collection and click the pencil-edit button to the right.
3. When editing a document, be sure to conform to the [standard JSON format](http://json.org/example).

### Running the Database Locally

1. Go to `octogon/models/Company.js:12` and comment out the option to use the MongoLab database. It should look like this:
```javascript
var MONGO_URI = /*process.env['OCTAGON_MONGO_URI']   || */   'mongodb://localhost/test';
```

2. Here are links to installing and running MongoDB. If you have a Mac, follow [these instructions](http://blog.troygrosfield.com/2011/03/21/installing-and-running-mongodb-on-a-mac/). If you have a PC, follow [these instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/). These directions are geared towards a Mac environment will try to include commands for Windows computers as well. The documentation on the [MongoDB website](http://docs.mongodb.org) is also very good.

## Running the App

There are several ways to run the application:

`$ node app.js` or `$ node app` runs the application. Each time a .js file is changed, you will have to restart the app. To fix this issue, run supervisor.

`$ supervisor app.js` or `$ supervisor app` runs the application just as `node app`, but it also watches for changes and on a change restarts. To run this command, you'll have to first install supervisor by executing `$ npm install supervisor`.
		
## Watch for SASS changes
Go to the root directory of the app and execute `$ grunt watch`.

## Misc
`$ grunt cssmin` minifies your css file	

`$ grunt jslint` highlights JSLint errors

`$ mocha` runs any tests
 
# Support
If you have any questions about how to run Octogon, email Devon Zuegel at [devonz@cs.stanford.edu](mailto:devonz@cs.stanford.edu).