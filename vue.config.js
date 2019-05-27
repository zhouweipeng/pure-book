module.exports = {
	baseUrl: './',
	
	configureWebpack: {
		devServer: {
			proxy: {
				"/api": {
					target: "http://novel.juhe.im",
					pathRewrite: {"^/api" : ""},
					changeOrigin: true
				},
				"/zxc": {
					target: "http://api.zhuishushenqi.com",
					pathRewrite: {"^/zxc" : ""},
					changeOrigin: true
				},
				"/read": {
					target: "http://chapter2.zhuishushenqi.com",
					pathRewrite: {"^/read" : ""},
					changeOrigin: true
				}
			}
		}
	}
}