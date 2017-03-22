var coverageFolder = process.env.CIRCLE_TEST_REPORTS === undefined ? 'coverage' : process.env.CIRCLE_TEST_REPORTS + '/coverage';
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['controllers/**/*.js'],//,'public/app/controllers/**/*.js'
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'models/*.js', 'controllers/**/*.js','public/app/controllers/**/*.js'],

            options: {
                // options here to override JSHint defaults
                globals: {
                    shadow:true,
                    mocha:true,
                    iterator:true,
                    singleGroups:true,
                    strict:true,
                    funcscope:true,
                    camelcase:true,
                    phantom:true, node:true,
                    futurehostile:true,
                    noempty:true,
                    noarg:true,
                    eqeqeq:true,
                    nocomma:true,
                    jquery:true,
                    nonbsp:true,
                    browser:true,
                    bitwise:true,
                    undef:true,
                    globalstrict:true,
                    notypeof:true,
                    nonew:true,
                    forin:true,
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },
        mochaTest: {
            local: {
              options: {
                reporter: 'spec',
                //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                ui: 'tdd'
              },
              src: ['test/**/*.js']
            },
            circleci: {
              options: {
                ui: 'tdd',
                reporter: 'mocha-junit-reporter',
                quiet: false,
                reporterOptions: {
                  mochaFile: process.env.CIRCLE_TEST_REPORTS + '/mocha/results.xml'
                }
              },
              src: ['test/**/*.js']
            }
        },
        mocha_istanbul: {
          coverage: {
              src: 'test', // a folder works nicely
              options: {

                  excludes: ['controllers/*.js', 'config/*.js', 'models/Measurement.js', 'routes/*.js', 'app.js'],
                  mochaOptions: ['--ui', 'tdd'], // any extra options for mocha
                  istanbulOptions: ['--dir', coverageFolder]
              }
          }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                runnerPort: 9876,
                browsers: ['PhantomJS'],
                plugins: [
                    // these plugins will be require() by Karma
                    'karma-jasmine',
                    "karma-coverage",
                    "karma-phantomjs-launcher"
                ]
            }
        },
        coveralls: {
            options: {
                debug: true,
                coverageDir: coverageFolder,
                dryRun: true,
                force: true,
                recursive: true
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-mocha'); Client Side testing
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-karma-coveralls');

    //test alljshint
    grunt.registerTask('testjshintall', ['jshint', 'qunit', 'concat', 'uglify']);

    //test jshint
    grunt.registerTask('testjshint', ['jshint']);

    // Default task(s).
    grunt.registerTask('default', []);

    //Test
    grunt.registerTask('test', ['mochaTest:local']);

    // Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    // CircleCI
    grunt.registerTask('circleci', ['mochaTest:circleci', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);

    //karma
    grunt.registerTask('karmatest', ['karma']);

    //coverage
     grunt.registerTask('karmacoverage', ['coveralls']);

};
