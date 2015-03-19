module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['src/lib/**/*', 'js/*'],
        tasks: ['concat:js']
      },
      style: {
        files: 'stylesheets/**/*',
        tasks: ['concat:bootstrap_style', 'concat:app_style', 'sass', 'cssmin']
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['copy']
      }
    },

    concat: {
      bootstrap_style: {
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dest: 'stylesheets/bootstrap.css'
      },
      app_style: {
        src: ["stylesheets/*.css"],
        dest: 'stylesheets/app.css'
      },
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js', // always jQuery before bootstrap
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'js/*.js'
        ],
        dest: 'public/js/app.min.js'
      }
    },

    sass: {
      dist: {
       files: {
          'stylesheets/app.css': 'stylesheets/app.scss',
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'public/js/app.min.js': 'public/js/app.min.js'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'public/stylesheets/app.min.css': 'stylesheets/app.css',
          'public/stylesheets/bootstrap.min.css': 'stylesheets/bootstrap.css',
        }
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'assets/',
        src: '**',
        dest: 'public/assets/'
      },
      fonts:{
        expand: true,
        cwd: 'node_modules/bootstrap/fonts/',
        src: '**',
        dest: 'public/fonts/'
      }
    },

    clean: {
      css: ['stylesheets/*.map', 'stylesheets/*.css']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['sass', 'concat:app_style', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'copy', 'clean']);
  
  grunt.registerTask('prod', ['sass', 'concat:app_style', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'uglify',  'copy', 'clean']);
};