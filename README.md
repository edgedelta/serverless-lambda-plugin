# Serverless Plugin

This plugin has been generated using the `plugin` template from the [Serverless Framework](https://www.serverless.com/).

## Implementing your plugin

When developing your plugin, please refer to the following sources:

- [Plugins Documentation](https://www.serverless.com/framework/docs/providers/aws/guide/plugins/)
- [Blog - How to create serverless plugins - Part 1](https://serverless.com/blog/writing-serverless-plugins/)
- [Blog - How to create serverless plugins - Part 2](https://serverless.com/blog/writing-serverless-plugins-2/)

## Sharing your plugin

We are currently using public organization scoped npm packages to publish our plugin. 
```
npm run build
npm publish --access public   
```

On the Serverless service side, you can install the plugin by running:
```
serverless plugin install -n  @edgedelta/serverless-lambda-extension

```
which will install the latest version.

Also our plugin needs some configuration variables:
- enabled: when set to false, no operation is done. Defaults to true
- edEndpoint: Edge Delta hosted environment endpoint. Required if operation is set to "add"
- operation: Supports adding "add" and removing "remove" Edge Delta lambda extension. Defaults to "add".
- excludeFunctions: Function names you want to exclude from either operation.
- enableTags: Tags configured on the function is added to the lambda environmnet with ED_TAG_ prefix. Defaults to false.

Sample config:
```
custom:
  edgedelta:
    enabled: true
    edEndpoint: "https://us-west-2.aws.ingress.edgedelta.com/listen/179d2640-fafb-4d3f-81ea-ad3abda3c239"
    operation: "add"
    excludeFunctions: ["dev-lambdaName2"]
    enableTags: true
```

In order to deploy function with extension we currently support:
```
serverless deploy function --function <func name> --verbose

```

In order to do full deploy:
```
serverless deploy --verbose
```