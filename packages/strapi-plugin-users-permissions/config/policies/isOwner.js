const _ = require('lodash');

module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.unauthorized();
  }

  if (!_.get(strapi.plugins['users-permissions'], 'config.createdBy')) {
    return await next();
  }

  const {plugin, controller: model} = ctx.request.route;

  if (ctx.params._id) {
    const data = await (plugin ? strapi.plugins[plugin] : strapi.api[model]).services[model].fetch(ctx.params);

    if (data.owner.id == ctx.state.user.id || data.owner._id == ctx.state.user._id) {
      return await next();
    } else {
      return ctx.unauthorized();
    }
  } else {
    ctx.query.owner = ctx.state.user._id;
  }

  await next();
};
