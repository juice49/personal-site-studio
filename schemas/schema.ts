import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import jam from './jam'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([jam]),
})
