define([
    'Backbone',
    'Underscore',
    '../models/user',
    'text!templates/myFeeds.html'
], function (Backbone, _, UserModel, myFeedsTemplate) {
    var View = Backbone.View.extend({
        el      : "#myFeeds",
        template: _.template(myFeedsTemplate),


        initialize: function (options) {
            this.render();
        },


        render: function () {
            var self = this;
            this.$el.html(this.template());

            return this;
        }
    });

    return View;
});
