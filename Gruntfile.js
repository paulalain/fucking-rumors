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
        tasks: ['concat', 'sass', 'cssmin']
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['copy']
      }
    },

    concat: {
      vendor_style: {
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dest: 'public/style/bootstrap.css'
      }
    },

    sass: {
      dist: {
        files: [{
          "expand": true,
          "cwd": "src/styles/",
          "src": ["*.scss"],
          "dest": "dist/styles/",
          "ext": ".css"
        }]
      }
    },

    uglify: {
      dist: {
        files: {
          'public/scripts/app.min.js': 'public/scripts/app.js'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'public/style/app.min.css': 'public/style/app.css',
          'public/style/bootstrap.min.css': 'public/style/bootstrap.css',
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', [
    'concat', 'uglify', 'sass', 'cssmin', 'copy'
  ]);
  
  grunt.registerTask('prod', [
    'concat', 'uglify', 'sass', 'cssmin', 'copy'
  ]);
};