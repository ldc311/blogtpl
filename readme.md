用两种方法处理Panini模板。
1，使用handlebars-loader，这个方法不能打包img
模板的参数在pages/xxx.hbs文件中，使用front-matter读取。

2，使用html-loader，在preprocessor中修改返回的内容。

# npm init -y
# npm install webpack webpack-cli --save-dev
# npm install html-loader file-loader  url-loader style-loader css-loader --save-dev
# npm install postcss-loader autoprefixer --save-dev
# npm install sass-loader node-sass --save-dev
# npm install --save jquery popper.js
# npm install bootstrap 
# npm i https://github.com/iconic/open-iconic.git -D
# npm install --save-dev mini-css-extract-plugin