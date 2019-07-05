import generateFactoryChildren from './utils/generateFactoryChildren'

console.log(
  generateFactoryChildren({
    id: 1,
    upperBound: 3000,
    lowerBound: 10,
    childrenLength: 12,
    timesGenerated: 1
  })
)
