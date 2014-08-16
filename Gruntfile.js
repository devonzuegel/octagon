module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/styles/css/screen.css': 'public/styles/sass/screen.scss'
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
