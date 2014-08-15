module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/stylesheets/css/screen.css': 'public/stylesheets/sass/screen.scss'
        }
      }
    },
    watch: {
      files: '**/*.scss',
      tasks: 'default'
    }
  });

  // Dependencies
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', 'sass');
  grunt.registerTask('deploy', ['watch']);

};
