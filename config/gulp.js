var dest = './public',
    src = './client';

module.exports = {
    browserSync: {
        proxy: "localhost:5000",
        //files: ["public/**/*.*"],
        //browser: "google chrome",
        //port: 7000,
        /*server: {
         // We're serving the src folder as well
         // for sass sourcemap linking
         baseDir: [dest, src]
         },*/
        serveStatic: [
            dest
        ]
        //files: [
        //    dest + '/**/*.*'
        // ]
    },
    markup: {
        src: src + "/views/**",
        dest: dest + '/views/'
    },
    browserify: {
        // Enable source maps
        debug: true,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries: [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-mocks/angular-mocks.js',
                    'node_modules/angular-resource/angular-resource.js',
                    'node_modules/angular-messages/angular-messages.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    'node_modules/angular-animate/angular-animate.js',
                    'node_modules/angular-local-storage/dist/angular-local-storage.js',
                    'node_modules/angular-aria/angular-aria.js',
                    'node_modules/angular-material/angular-material.js',
                    'node_modules/angular-ui-router/release/angular-ui-router.js',
                    'node_modules/moment/moment.js',
                    'node_modules/moment/locale/fr.js',
                    'node_modules/angular-moment/angular-moment.js',
                    'node_modules/angular-material-data-table/dist/md-data-table.js'
                ],
                dest: dest + '/js',
                outputName: 'vendors.js'
            },
            {
                entries: src + '/js/**/*.js',
                dest: dest + '/js',
                outputName: 'app.js'
            }
        ],
        extensions: ['.js']
    },
    sass: {
        src: src + '/sass/*.scss',
        dest: dest + '/css',
        temp: src + '/sass/temp'
    }
};