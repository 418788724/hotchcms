const BASE_URL = 'http://localhost:3030'
const API_URL = `${BASE_URL}/api`

module.exports = {
  name: 'Hotchcms',
  prefix: 'hotchcms',
  footerText: 'Hotchcms',
  openPages: ['/login', '/install'],
  get inAuth () {
    return `${this.prefix}InAuth`
  },
  get jwt () {
    return `${this.prefix}JWT`
  },
  getImgUrl (path) {
    return `${BASE_URL}/upload/${path}`
  },
  api: {
    signIn: `${API_URL}/admin-account/sign-in`, // 登录
    signOut: `${API_URL}/admin-account/sign-out`, // 注册
    captcha: `${API_URL}/common/captcha`, // 验证码
    current: `${API_URL}/admin-account`, // 获取当前用户
    dashboard: `${API_URL}/dashboard`,
    adminUser: `${API_URL}/admin-user/:_id`, // 管理员
    adminGroup: `${API_URL}/admin-group/:_id`, // 管理组
    category: `${API_URL}/category/:_id`, // 分类
    content: `${API_URL}/content/:_id`, // 内容
    siteInfo: `${API_URL}/site-info`, // 站点信息
    theme: `${API_URL}/theme/:_id`, // 主题
    authority: `${API_URL}/authority`, // 权限
    media: `${API_URL}/media`, // 多媒体

    install: `${API_URL}/install`, // 安装
    testDatabase: `${API_URL}/install/test-database`, // 检测数据裤
    testRedis: `${API_URL}/install/test-redis`, // 检测redis
  },
}
