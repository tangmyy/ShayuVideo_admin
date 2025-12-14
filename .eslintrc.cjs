module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 'latest',  // 确保使用最新ECMAScript版本
        sourceType: 'module',   // 启用ES模块语法
        requireConfigFile: false
    },
    plugins: [
        'vue'
    ],
    rules: {
        // 可在此处添加自定义规则
    }
};