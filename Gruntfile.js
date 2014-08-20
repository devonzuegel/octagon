module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'public/styles/css/screen.css': 'public/styles/sass/screen.scss'
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'public/styles/css/screen.min.css': [ 'public/styles/css/screen.css' ]
        }
      }
    },
    watch: {
      files: '**/*.scss',
      tasks: 'default'
    },
    jshint: {
      files: [
        'Gruntfile.js', 
        'public/js/**/*.js', 
        'test/**/*.js', 
        'models/**/*.js', 
        'routes/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }
  });

  // Dependencies
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', 'sass');
  grunt.registerTask('deploy', 'watch');
  grunt.registerTask('minify', 'cssmin');
  grunt.registerTask('js', 'jshint');

};
