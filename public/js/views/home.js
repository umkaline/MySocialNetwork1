define([
    'Backbone',
    'Underscore',
    '../models/user',
    'views/profile',
    'views/myFeeds',
    'text!templates/home.html'
], function (Backbone, _, UserModel, ProfileView, MyFeedsView, homeTemplate) {
    var View = Backbone.View.extend({
        el      : "#content",
        template: _.template(homeTemplate),

        initialize: function (options) {
            this.render();

            if (this.profileView) {
                this.profileView.undelegateEvents()
            }

            this.profileView = new ProfileView();

            if (this.myFeedViews) {
                this.myFeedViews.undelegateEvents()
            }

            this.myFeedViews = new MyFeedsView();
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());

            return this;
        }
    });

    return View;
});
