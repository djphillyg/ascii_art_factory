import _ from 'lodash';

const data = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'Boston' },
  { name: 'Bob', age: 35, city: 'Chicago' },
];

const groupedByCity = _.groupBy(data, 'city');
const sortedByAge = _.sortBy(data, 'age');
const names = _.map(data, 'name');

console.log('Grouped by city:', groupedByCity);
console.log('Sorted by age:', sortedByAge);
console.log('Names:', names);

export { data, groupedByCity, sortedByAge, names };