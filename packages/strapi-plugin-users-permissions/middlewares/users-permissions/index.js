'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const pluralize = require('pluralize');

module.exports = strapi => {
  return {
    beforeInitialize: function() {
      strapi.config.middleware.load.before.unshift('users-permissions');
    },

    initialize: function(cb) {
      _.forEach(strapi.config.routes, value => {
        if (_.get(value.config, 'policies')) {
          value.config.policies.unshift('plugins.users-permissions.permissions');
        }
      });

      if (strapi.plugins) {
        _.forEach(strapi.plugins, (plugin, name) => {
          _.forEach(plugin.config.routes, value => {
            if (_.get(value.config, 'policies')) {
              value.config.policies.unshift('plugins.users-permissions.permissions');
            }
          });
        });
      }

      if (_.get(strapi.plugins['users-permissions'], 'config.createdBy')) {
        for (const model in strapi.models) {
          strapi.models[model].attributes['owner'] = {
            model: 'user',
            via: pluralize.plural(model.toLowerCase()),
            plugin: 'users-permissions',
            configurable: false
          };

          strapi.plugins['users-permissions'].models.user.attributes[pluralize.plural(model.toLowerCase())] = {
            collection: model.toLowerCase(),
            via: 'owner',
            configurable: false
          };
        }

      }

      cb();
    }
  };
};
