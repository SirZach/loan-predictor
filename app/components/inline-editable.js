import Ember from 'ember';

export default Ember.Component.extend({

  isEditing: false,

  click: function () {
    this.set('isEditing', true);
  },

  focusOut: function () {
    this.set('isEditing', false);
    this.sendAction('action', this.get('value'), this.get('number'));
  }
});
