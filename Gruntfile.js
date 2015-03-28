module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['src/lib/**/*', 'src/client/*', 'src/client/**/*'],
        tasks: ['concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'copy', 'clean']
      },
      style: {
        files: 'stylesheets/*.scss',
        tasks: ['concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'copy', 'clean']
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'copy', 'clean']
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
        src: ["stylesheets/*.scss"],
        dest: 'stylesheets/appconcat.scss'
      },
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js', // always jQuery before bootstrap
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/angular/angular.min.js',
          'node_modules/angular/angular-route.min.js',
          'src/client/app.js',
          'src/client/controllers/*.js',
          'src/client/directives/*.js',
          'src/client/filters/*.js',
          'src/client/services/*.js',
        ],
        dest: 'public/js/app.min.js'
      }
    },

    sass: {
      dist: {
            files: [{
            expand: true,
            cwd: 'stylesheets/',
            src: ['appconcat.scss'],
            dest: 'stylesheets/',
            ext: '.css'
          }]
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
          'stylesheets/app.min.css': 'stylesheets/appconcat.css',
          'stylesheets/bootstrap.min.css': 'stylesheets/bootstrap.css',
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
      },
      styles:{
        expand: true,
        cwd: 'stylesheets/',
        src: '*.min.css',
        dest: 'public/stylesheets/'
      }
    },

    clean: {
      css: ['stylesheets/*.map', 'stylesheets/*.css', 'stylesheets/appconcat.scss']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['concat:app_style','sass:dist',  'concat:bootstrap_style', 'concat:js', 'cssmin', 'copy', 'clean']);
  
  grunt.registerTask('prod', ['sass', 'concat:app_style', 'concat:bootstrap_style', 'concat:js', 'cssmin', 'uglify',  'copy', 'clean']);
};