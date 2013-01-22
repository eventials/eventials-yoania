var exec = require('child_process').exec;

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      yoania: ['static/js/yoania.js']
    },
    jshint: {
      yoania: {
        options: {
          node: true
        }
      }
    },
    min: {
      dist: {
        src: ['static/js/yoania.js'],
        dest: 'static/js/yoania.min.js'
      }
    }
  });

  // Default Task.
  grunt.registerTask('default', 'lint');
};