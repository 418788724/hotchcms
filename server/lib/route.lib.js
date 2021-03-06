const path = require('path')
const _ = require('lodash')
const Router = require('koa-router')
const requireAll = require('require-all')
const routes = require('../routes')

const router = new Router() // 基础路由
const auth = new Router() // 验权路由
const notes = {} // 路由描述

/**
 * 读取控制器
 */
const controllers = requireAll({
  dirname: path.join(__dirname, '../controllers/'),
  filter: /(.+)\.controller\.js$/,
});

/**
 * 递归绑定控制器
 */
(function loop (map, route) {
  route = route || ''

  _.forEach(map, (value, key) => {
    if (_.isObject(value) && !_.isArray(value)) {
      // { '/path': { ... }}
      loop(value, route + key)
    } else {
      if (_.isString(value)) {
        /**
         * 'controller.action'
         * 'controller.action#description'
         * '*controller.action'
         * 'controller'
         */
        let controller
          , action
          , description
          , inAuthed
          , fn

        // 是否需要验权限
        inAuthed = value.indexOf('*') !== -1

        // 备注
        description = value.split('#')[1] || ''

        // 解析 => controller.action
        value = value.replace(/^\*/g, '')
        value = value.split('#')[0]

        // 提取 controller / action
        controller = value.split('.')[0]
        action = value.split('.')[1]

        // 路由描述
        notes[`${route}[${key}]`] = description

        // 获取控制器函数
        fn = action ? controllers[controller][action] : controllers[controller]

        // 路由绑定函数
        if (inAuthed) {
          router[key](route, controllers.check()) // 验证状态
          auth[key](route, fn)
        }
        router[key](route, fn)
      }
    }
  })
}(routes))

module.exports = router
module.exports.auth = auth
module.exports.notes = notes
