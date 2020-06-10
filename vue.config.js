module.exports = {
  devServer: {
    proxy: {
      '/modbus': {
        target: 'https://s3.cn-northwest-1.amazonaws.com.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/modbus': '',
        },
      }
    },
  },
};
