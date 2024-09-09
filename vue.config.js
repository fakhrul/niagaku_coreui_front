module.exports = {
  devServer: {
    host: '0.0.0.0', // Allow access from any IP
    port: 8080, // Your desired port
    disableHostCheck: true, // Disable host checking (not recommended for production)
    allowedHosts: [
      '.safa.com.my', // Allow subdomains (e.g., myledger.safa.com.my)
      'localhost', // Allow localhost
    ],
  },
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils'
  ],
  // use this option for production linking
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/3.1.0' : '/'
}
