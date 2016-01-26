define([
    'Backbone',
    'Underscore',
    'models/user',
    'text!templates/admin/menu.html'
], function (Backbone, _, UserModel, menuTemplate) {
    var View = Backbone.View.extend({
        el      : "#menu",
        template: _.template(menuTemplate),

        initialize: function (options) {

            this.render();

            if (APP.io) {
                APP.io.disconnect();
                delete APP.io;
            }
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());

            return this;
        }
    });

    return View;
});
