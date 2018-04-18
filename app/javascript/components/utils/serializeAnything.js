// Maybe we can move this somewhere else... could be usefull
// i built this because we need to serialize the data to work with our tables
// instead of re-writing serialize logic we have this util that can serialize anything to your specification.

/**
  @usage:
  @syntax: SerializeAnything(src, mapper)
  @example
  originalData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      origin: 'Swedish',
      age: 28
    },
    {
      firstName: 'Lisa',
      lastName: 'Doe',
      origin: 'Spanish',
      age: 32
    }
  ]

  SerializeAnything(originalData, {
    name: 'firstName,lastname',
    country: 'origin',
    age
  })

  @outputs
  [
    {
      name: 'John Doe,
      country: 'Swedish',
      age: 28
    },
    {
      name: 'Lisa Doe',
      country: 'Spanish',
      age: 32
    }
  ]
*/

export default function ( { data = [], rules = {} }) {

  console.log('serializeAnything', data, rules);

}
