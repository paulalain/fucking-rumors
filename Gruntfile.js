module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/lib/**/*', 'src/client/*', 'src/client/**/*'],
                tasks: ['concat:js', 'copy:js', 'clean:js']
            },
            style: {
                files: 'stylesheets/*.scss',
                tasks: ['concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'cssmin', 'copy:css', 'clean:css']
            },
            assets: {
                files: 'assets/**/*',
                tasks: ['copy:assets']
            }
        },

        concat: {
            bootstrap_style: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
                ],
                dest: 'tmp/stylesheets/bootstrap.css'
            },
            app_style: {
                src: ["stylesheets/*.scss"],
                dest: 'tmp/stylesheets/appconcat.scss'
            },
            js: {
                src: [
                    'node_modules/jquery/dist/jquery.min.js', // always jQuery before bootstrap
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular/angular-route.min.js',
                    'node_modules/ng-flow/dist/ng-flow-standalone.min.js',
                    'src/client/app.js',
                    'src/client/controllers/*.js',
                    'src/client/directives/*.js',
                    'src/client/filters/*.js',
                    'src/client/services/*.js',
                ],
                dest: 'tmp/js/app.min.js'
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'tmp/stylesheets/',
                    src: ['appconcat.scss'],
                    dest: 'tmp/stylesheets/',
                    ext: '.css'
                }]
            }
        },

        uglify: {
            dist: {
                files: {
                    'tmp/js/app.min.js': 'tmp/js/app.min.js'
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'tmp/stylesheets/app.min.css': 'tmp/stylesheets/appconcat.css',
                    'tmp/stylesheets/bootstrap.min.css': 'tmp/stylesheets/bootstrap.css',
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
            fonts: {
                expand: true,
                cwd: 'node_modules/bootstrap/fonts/',
                src: '**',
                dest: 'public/fonts/'
            },
            css: {
                expand: true,
                cwd: 'tmp/stylesheets/',
                src: '*.min.css',
                dest: 'public/stylesheets/'
            },
            js: {
                expand: true,
                cwd: 'tmp/js/',
                src: '*.min.js',
                dest: 'public/js/'
            }
        },

        clean: {
            css: ['tmp/stylesheets/*'],
            js: ['tmp/js/*']
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['concat:js', 'copy:js', 'clean:js', 
                                    'concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'cssmin', 'copy:css', 'clean:css',
                                    'copy:assets']);
    grunt.registerTask('prod', ['concat:js', 'copy:js', 'uglify', 'clean:js', 
                                    'concat:app_style', 'sass:dist', 'concat:bootstrap_style', 'cssmin', 'copy:css', 'clean:css',
                                    'copy:assets']);
};