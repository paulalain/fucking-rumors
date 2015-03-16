module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['src/lib/**/*', 'src/client/**/*'],
        tasks: ['uglify']
      },
      style: {
        files: 'stylesheets/**/*',
        tasks: ['concat:app_style', 'sass', 'cssmin']
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
        dest: 'public/stylesheets/bootstrap.css'
      },
      app_style: {
        src: ["stylesheets/*.css"],
        dest: 'public/stylesheets/app.css'
      },
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js', // always jQuery before bootstrap
          'node_modules/bootstrap/dist/js/bootstrap.min.js',

        ],
        dest: 'public/js/app.min.js'
      }
    },

    sass: {
      dist: {
       files: {
          'public/stylesheets/app.css': 'stylesheets/app.scss',
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
          'public/stylesheets/app.min.css': 'public/stylesheets/app.css',
          'public/stylesheets/bootstrap.min.css': 'public/stylesheets/bootstrap.css',
        }
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'assets/',
        src: '**',
        dest: 'public/assets/'
      }
    },

    remove: {
      options: {
        trace: true
      },
      fileList: ['public/stylesheets/bootstrap.css', 'public/stylesheets/app.css']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-remove');

  grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'uglify',  'copy', 'remove']);
  
  grunt.registerTask('prod', ['sass', 'concat', 'cssmin', 'uglify',  'copy', 'remove']);
};