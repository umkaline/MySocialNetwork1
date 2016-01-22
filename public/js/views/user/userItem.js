define([
    'Backbone',
    'views/user/editItem',
    'text!templates/user/userItem.html'
], function(Backbone, EditView, UserTemplate){
    var View = Backbone.View.extend({
        tagName: 'tr',
        template: _.template(UserTemplate),

        events: {
            'click .edit': 'editItem',
            'click .remove': 'removeItem'
        },

        initialize: function(options){
            this.render();
        },

        editItem: function(){
            var self = this;

            new EditView({model: this.model});
        },

        removeItem: function(){
            var self = this;

            this.model.destroy({
                success: function(model){
                    self.remove();
                },
                error: function(model, hxr){
                    alert(hxr.responseText);
                }
            });
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return View;
});
