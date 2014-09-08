# Octogon

An application that venture capital firms can use to better manage their portfolios.

# Useful commands

- `$ mongod --dbpath data` runs MongoDB

- There are several ways to run the application:
	- `$ node app.js` or `$ node app` runs the application. Each time a .js file is changed, you will have to restart the app.
	- `$ supervisor app.'s` or `$ supervisor app` runs the application just as `node app`, but it also watches for changes and on a change restarts. To run this command, execute `$ npm install supervisor`.

- `$ grunt watch` watches for SASS changes

- `$ grunt cssmin` minifies your css file

- `$ grunt jslint` highlights JSLint errors

- `$ mocha` runs any tests