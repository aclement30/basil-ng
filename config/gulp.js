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