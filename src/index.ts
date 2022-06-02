import * as Serverless from "serverless";
import { FunctionDefinition } from "serverless";
import Service from "serverless/classes/Service";

import { getConfig } from "./config";
import { addExtension, removeExtension} from "./extension";
import * as extensions from "./extensions.json";

const allAvailableExtensions = { regions: { ...extensions } };

module.exports = class ServerlessPlugin {
  public hooks = {
    "before:package:package": this.validateConfig.bind(this),
    "before:deploy:deploy": this.handleLambdaExtension.bind(this),
    // "deploy:deploy": this.handleLambdaExtension.bind(this),
    "before:deploy:function:packageFunction": this.validateConfig.bind(this),
    "before:deploy:function:deploy": this.handleLambdaExtension.bind(this),
  };

  constructor(private serverless: Serverless, _: Serverless.Options) {}

  private async validateConfig() {
    const config = getConfig(this.serverless.service);
    this.serverless.service.resources
    if (config.enabled === false) return;
    console.log("Validating configuration");
    console.log("config", config);
    if (config.operation === "add" && !config.edEndpoint) {
      throw new Error("'edEndpoint' is required for the plugin to work if operation is add.");
    }
  }

  private async handleLambdaExtension() {
    const config = getConfig(this.serverless.service);
    if (config.enabled === false) return;
    if (config.operation == "add") {
      this.addLambdaExtension();
    } else {
      this.removeLambdaExtension();
    }
  }

  private async addLambdaExtension() {
    const config = getConfig(this.serverless.service);
    if (config.enabled === false) return;
    const functions = getConfiguredFunctions(this.serverless.service, config.excludeFunctions);
    console.log("Adding Edge Delta Lambda Extension Layer to functions");
    addExtension(this.serverless.service, functions, allAvailableExtensions, config);
  }

  private async removeLambdaExtension() {
    const config = getConfig(this.serverless.service);
    if (config.enabled === false) return;
    const functions = getConfiguredFunctions(this.serverless.service, config.excludeFunctions);
    console.log("Removing Edge Delta Lambda Extension Layer from functions");
    removeExtension(this.serverless.service, functions, allAvailableExtensions);
  }

}

function getConfiguredFunctions(service: Service, exclude: string[] | undefined): FunctionDefinition[] {
  return Object.entries(service.functions)
    .map(([_, handler]) => { return handler})
    .filter((result) =>
      exclude === undefined || (exclude !== undefined && result.name !== undefined && !exclude.includes(result.name)),
    );
}