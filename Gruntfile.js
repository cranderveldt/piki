module.exports = function(grunt) {
    "use strict";
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        
        
        // The lint task will run the build configuration and the application
        // JavaScript through JSHint and report any errors.  You can change the
        // options for this task, by reading this:
        // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
      
        // Set our jshint options here:
        // http://www.jshint.com/options/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    console: false,
                    FB: false,
                    google: false,
                    jQuery: false,
                    _: false
                }
            },
            all: {
                src: ['dev/jquery.blueselect.dev.js']
            }
        },
        
        // The concatenate task is used here to all libraries from the lib
        // folder.  We exclude jQuery, because we call that from Google's
        // CDN.
        // You may or may not want to include the JS we write depending on how
        // often it changes.
       
        uglify: {
            // Takes the built sourcejs file and minifies it for filesize benefits.
            // Create a minified version in case you need to test minification locally.
            min: {
                src: ["dev/jquery.blueselect.dev.js"],
                dest: "dist/jquery.blueselect.min.js"
            }
        },
          
        sass: {
            dist: {
                options: {
                    style: 'compact',
                    compass: 1,
                    debugInfo: false,
                    lineNumbers: false
                },
                files: {
                    'dist/styles.css': 'dev/styles.scss', // 'destination': 'source'
                }
            }
        },
        
        // This sets up watch configurations
        watch: {
            all: {
                files: ['dev/*.scss', 'dev/*.js'],
                tasks: ['common','sass:dist']
            }
        },
    });
    
    
    // Load the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadTasks('grunt');

    // Default task(s).
    grunt.registerTask("common", ['jshint:all', 'uglify']);
    grunt.registerTask("default", ['common', 'sass:dist', 'watch:all']);
};
