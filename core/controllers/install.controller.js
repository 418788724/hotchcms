const send = require('koa-send');
const database = require('../lib/database.lib');
const logger = require('../lib/logger.lib');
const installService = require('../services/install.service');

exports.access = async ctx => {
  try {
    const hasInstall = await installService.status();
    if (hasInstall) {
      next()
    } else {
      await send(ctx, './public/assets/admin/index.html');
    }
  } catch (e) {

  }
}

exports.status = async ctx => {
  try {
    const hasInstall = await installService.status();
    if (hasInstall) {
       ctx.pipeFail(404);
    } else {
      ctx.pipeDone();
    }
  } catch (e) {
    ctx.pipeFail(500);
  }
}

exports.testDatabase = async ctx => {
  ctx.checkBody({
    'host': {
      notEmpty: {
        options: [true],
        errorMessage: 'host 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'host 格式不正确'
      }
    },
    'port': {
      notEmpty: {
        options: [true],
        errorMessage: 'port 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'port 需为0-65535之间的整数'
      }
    },
    'db': {
      notEmpty: {
        options: [true],
        errorMessage: 'database 不能为空'
      },
      isString: { errorMessage: 'database 需为字符串' }
    },
    // 'user': {
    //   isString: { errorMessage: 'user 需为字符串' }
    // },
    // 'pass': {
    //   isString: { errorMessage: 'password 需为字符串' }
    // }
  });

  if (ctx.validationErrors()) return null;

  const req = ctx.request.body;

  const opts = {
    host: req.host,
    port: req.port,
    db: req.db,
    // user: req.user,
    // pass: req.pass
  };
  try {
    const status = await database.test(opts);
    if (status) ctx.pipeDone();
  } catch (e) {
    ctx.pipeFail(500,'验证失败',e);
  }

};

exports.install = async ctx => {
  ctx.checkBody({
    'databaseHost': {
      notEmpty: {
        options: [true],
        errorMessage: 'databaseHost 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'databaseHost 格式不正确'
      }
    },
    'databasePort': {
      notEmpty: {
        options: [true],
        errorMessage: 'databasePort 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'databasePort 需为整数'
      }
    },
    'database': {
      notEmpty: {
        options: [true],
        errorMessage: 'database 不能为空'
      },
      isString: { errorMessage: 'database 需为字符串' }
    },
    // 'databaseUser': {
    //   notEmpty: {
    //     options: [true],
    //     errorMessage: 'databaseUser 不能为空'
    //   },
    //   isString: { errorMessage: 'databaseUser 需为字符串' }
    // },
    // 'databasePassword': {
    //   notEmpty: {
    //     options: [true],
    //     errorMessage: 'databasePassword 不能为空'
    //   },
    //   isString: { errorMessage: 'databasePassword 需为字符串' }
    // },
    'theme': {
      notEmpty: {
        options: [true],
        errorMessage: 'theme 不能为空'
      },
      isString: { errorMessage: 'theme 需为字符串' }
    },
    // 导入示例数据，下一版本
    //'case': {
    //  notEmpty: {
    //    options: [true],
    //    errorMessage: 'case 不能为空'
    //  },
    //  isBoolean: { errorMessage: 'case 需为布尔值' }
    //},
    'title': {
      notEmpty: {
        options: [true],
        errorMessage: 'title 不能为空'
      },
      isString: { errorMessage: 'title 需为字符串' }
    },
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      matches: {
        options: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
        errorMessage: 'email 格式不正确'
      }
    },
    // 'nickname': {
    //   notEmpty: {
    //     options: [true],
    //     errorMessage: 'nickname 不能为空'
    //   },
    //   isString: { errorMessage: 'nickname 需为字符串' }
    // },
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于 6 位'
      }
    }
  });

  if (ctx.validationErrors()) return null;

  const req = ctx.request.body;

  var databaseDate = {
    host: req.databaseHost,
    port: req.databasePort,
    db: req.database,
    // user: req.databaseUser,
    // pass: req.databasePassword
  };

  var siteInfoDate = {
    title: req.title,
    theme: req.theme
  };

  var userDate = {
    email: req.email,
    // nickname: req.nickname,
    password: req.password
  };

  try {
    const hasInstall = await installService.status();
    if (hasInstall) return ctx.pipeFail(500,'cms已经安装');
    const install = await installService.install({
      databaseDate: databaseDate,
      siteInfoDate: siteInfoDate,
      userDate: userDate,
    });

    if (install) {
      ctx.pipeDone();
    }
  } catch (e) {
    ctx.pipeFail(500,'安装失败',e);
  }

}