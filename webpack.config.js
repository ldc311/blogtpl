const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var fs = require("fs");
const readFile = require("util").promisify(fs.readFile);
const fm = require('front-matter');
var Handlebars = require("handlebars");

//模仿panini的做法
function getHtmlConfig(name){
  let content;
  var fipath = './src/html/pages/' + name + '.html';
  try {
    var fr = fs.readFileSync(fipath,"utf-8");
    content = fm(fr);
    //替换body
    fipath = './src/html/layouts/' + content.attributes.layout + '.html';
    fr = fs.readFileSync(fipath,"utf-8");
    fr = fr.replace('{{> body}}', content.body);
    fipath = './src/html/layouts/' + content.attributes.layout + '_tmp.html';
    fs.writeFileSync(fipath, fr);
  } catch (err) {
      console.log('Error', err);
  }
  return  {
    template: './src/html/layouts/' + content.attributes.layout + '_tmp.html',
    //目标文件
    filename:  name + '.html',
    templateParameters: {
      title: content.attributes.title     
    }
  };
}
function loadPartials()
{
  let dir = './src/html/includes'
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
    } else {
        //console.log(file.substring(0, file.length-5));
        Handlebars.registerPartial(file.substring(0, file.length-5), fs.readFileSync(pathname,"utf-8"));
    }
  });
}
module.exports = {
    entry: './src/index.js',
    output: {    
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    module: {
      rules: [   
            {
              test: /\.hbs$/i,
              //include: path.resolve(__dirname, 'src/html/includes'),
              use: [
                // {
                //   loader: 'handlebars-loader',
                //   options: {
                //     partialDirs: [
                //         path.join(__dirname, 'src/html/includes')
                //     ],
                //     extensions: ['.html'],
                //     attrs:["img:src"]
                //   }
                // },
                {
                  loader: 'html-loader',
                  options: {
                    preprocessor: (content, loaderContext) => {    
                      //console.log('-------------' + loaderContext);                   
                      let result;
                      let frmatter;
                      try {
                        frmatter = fm(content);
                        let fipath = './src/html/layouts/' + frmatter.attributes.layout + '.html';
                        content = fs.readFileSync(fipath,"utf-8");
                        Handlebars.registerPartial('body', frmatter.body);
                        loadPartials();
                        result = Handlebars.compile(content)({
                          title: frmatter.attributes.title,
                          root: '../../assets/'
                        });
                      } catch (error) {
                        loaderContext.emitError(error);
          
                        return content;
                      }
          
                      return result;
                    },
                    //attributes: false,
                  },
                }
              ]
            },  
            { test: /\.css$/,  use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
            { test: /\.(woff|woff2)$/, use:"url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=image/svg+xml" },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: {
                loader: 'file-loader',
                options: {
                  outputPath: 'images'
                }
              }
            },
            {
              test: /\.scss$/,
              use: [{
                loader: MiniCssExtractPlugin.loader, 
              }, {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      //require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles Sass to CSS
              }],
            }
      ]
    },
    //将bootstrap的css和自己的css分开打包
    // https://github.com/webpack-contrib/mini-css-extract-plugin/tree/master/test/cases/split-chunks
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /node_modules/,
            enforce: true,
          },
        },
      },
    },
    plugins: [
      //new HtmlWebpackPlugin(getHtmlConfig("index")),
      new HtmlWebpackPlugin({
        template: './src/html/pages/index.hbs',
        filename: 'index.html',
      }),
      new HtmlWebpackPlugin({
        template: './src/html/pages/zhiye.hbs',
        filename: 'zhiye.html',
      }),
      new HtmlWebpackPlugin({
        template: '!!handlebars-loader!template.html',
        filename: 'index0.html',
        //模板文件中使用<%= htmlWebpackPlugin.options.title %> 
        title: 'test html templete ',
        //模板文件中使用 <%= foo %>
        templateParameters: {
          'foo': 'bar'
        },
      }),
      new MiniCssExtractPlugin({ filename: 'styles.css' })
    ]
};

