const {SchemaDirectiveVisitor} = require('graphql-tools')

exports.CustomBeehiveTypeDefs = `
  directive @honeycombBackgroundTask(background_task: String!) on FIELD_DEFINITION
`

class HoneycombBackgroundTaskDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const background_task = this.args.background_task

    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (obj, args, context, info) {
      console.log("In HoneycombBackgroundTaskDirective - field.resolve")

      // Example of how a background task could be kicked off
      // if (background_task === "BulkImportHandle") {
      //   <<RUN BKGD OPERATION HERE>>
      // }

      return await resolve.call(this, obj, args, context, info)
    }
  }
}

exports.CustomBeehiveDirectives = {
  honeycombBackgroundTask: HoneycombBackgroundTaskDirective
}
