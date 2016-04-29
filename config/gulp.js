var gulp = {
    input: 'client/**/*',
    output: 'public/',
    scripts: {
        input: 'client/js/*',
        output: 'public/js/'
    },
    styles: {
        input: 'client/sass/**/*.scss',
        output: 'public/css/'
    },
    svgs: {
        input: 'client/svg/*',
        output: 'public/svg/'
    },
    images: {
        input: 'client/img/*',
        output: 'public/img/'
    },
    vendors: {
        input: [
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
        output: 'public/js/',
        filename: 'vendors.js'
    },
    static: {
        input: 'client/views/*',
        output: 'public/views/'
    },
    test: {
        input: 'src/js/**/*.js',
        karma: 'test/karma.conf.js',
        spec: 'test/spec/**/*.js',
        coverage: 'test/coverage/',
        results: 'test/results/'
    },
    docs: {
        input: 'src/docs/*.{html,md,markdown}',
        output: 'docs/',
        templates: 'src/docs/_templates/',
        assets: 'src/docs/assets/**'
    }
};

module.exports = gulp;