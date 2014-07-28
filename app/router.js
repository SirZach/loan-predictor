import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LoanPredictorENV.locationType
});

Router.map(function() {
  this.resource('loan');
});

export default Router;
