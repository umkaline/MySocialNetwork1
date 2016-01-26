define([
    'Backbone',
    'Underscore',
    'models/user',
    'views/admin/menu',
    'text!templates/admin/main.html'
], function (Backbone, _, UserModel, MenuView, mainTemplate) {
    var View = Backbone.View.extend({
        el: "#content-holder",
        template: _.template(mainTemplate),

        events: {

        },

        initialize: function (options) {
            this.render();

                if (this.menuView) {
                    this.menuView.undelegateEvents()
                }
                this.menuView = new MenuView();
        },


        render: function () {
            this.$el.html(this.template());

                Backbone.history.navigate('myApp/admin/users', {trigger: true});

            return this;
        }
    });

    return View;
});
