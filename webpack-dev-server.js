const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config.js');

module.exports = (PORT, API_PORT) => {
    webpackConfig.entry.app.push(`webpack-dev-server/client?http://localhost:${PORT}/`);

    const server = new WebpackDevServer(webpack(webpackConfig), {
        port: 5000,
        contentBase: './public',
        stats: 'minimal',
        inline: true,
        hot: true,
        historyApiFallback: {
            index: '/'
        },
        proxy: {
            '/api': `http://localhost:${API_PORT}`,
            '/auth': `http://localhost:${API_PORT}`
        },
    });

    server.listen(PORT, 'localhost', (error) => {
        process.stdout.write(`\x1b[32mWebpack Dev server started on port ${PORT}\x1b[0m`);
    });
}