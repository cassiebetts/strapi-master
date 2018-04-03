module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.unauthorized();
  }

  const {plugin, controller: model} = ctx.request.route;

  if (ctx.params._id) {
    const data = await (plugin ? strapi.plugins[plugin] : strapi.api[model]).services[model].fetch(ctx.params);

    if (data.created_by.id == ctx.state.user.id || data.created_by._id == ctx.state.user._id) {
      return await next();
    } else {
      return ctx.unauthorized();
    }
  } else {

  }

  await next();
};
