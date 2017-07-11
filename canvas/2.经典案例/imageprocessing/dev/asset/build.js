(
// {
//     appDir: './../',
//     baseUrl: 'asset',
//     dir: './../../build',
//     fileExclusionRegExp: /^(r|build)\.js$/,
//     /*所有组件、插件、依赖js都配置在这里面*/
//     paths:{
//         // jquery: 'empty:' , 
//         jquery : './lib/jquery.min',
//         backtop : './ui/backtop',
//         scrollto : './ui/scrollTo',
//         jqueryUI : './ui/jquery.ui',
//         window : './ui/window',
//         widget : './ui/widget'
//     },
//     optimize: 'uglify',
//     /*每个页面对应的的js*/
//     modules: [
//         {
//             name: './business/mode1/A'
//         },
//         {
//             name: './business/mode2/B'
//         },
//     ],
//     // CSS 优化方式，目前支持以下几种：
//     // none: 不压缩，仅合并
//     // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
//     // standard.keepLines: 除标准压缩外，保留换行
//     // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
//     // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
//     optimizeCss: 'standard'
//     // 一般用于命令行，可将多个 CSS 资源文件打包成单个 CSS 文件
//     // cssIn: 'css/main.css',
//     // out: 'css/main.css'
//  }

    {
    appDir: './../',
    baseUrl: './asset',
    dir: './../../src',
    fileExclusionRegExp: /^(r|build)\.(js|txt)$/,
    /*所有组件、插件、依赖js都配置在这里面*/
    paths:{
        act:'./act',
        lib:'./lib',
        jquery:'./lib/jquery.min'
    },
    optimize: 'uglify',
    /*每个页面对应的的js*/
    modules: [
        {
            name: './act/demo',
        },
        {
            name: './act/demo2'
            // ,exclude: [
            //     "some"
            // ]
        },
    ],
    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss: 'standard'
    // 一般用于命令行，可将多个 CSS 资源文件打包成单个 CSS 文件
    // cssIn: 'css/main.css',
    // out: 'css/main.css'
 }
)

 