/**
 * Created by tennizmazter on 7/27/14.
 */

import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    this.transitionTo('loan');
  }
});