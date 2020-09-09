// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlTplPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('HtmlTplPlugin', (compilation) => {
      console.log('The compiler is starting a new compilation...')

      // Static Plugin interface |compilation |HOOK NAME | register listener 
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'HtmlTplPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.html += 'The Magic Footer'
          console.log(data.html);
          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = HtmlTplPlugin