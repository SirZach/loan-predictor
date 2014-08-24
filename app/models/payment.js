import Ember from 'ember';

export default Ember.Object.extend({
	number: null,

	date: function () {
		return moment().add(this.get('number'), 'M').format('MMMM YYYY');
	}.property('number'),

	modifiedByAlgorithm: false
});