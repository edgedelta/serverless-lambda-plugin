import { FunctionDefinition } from "serverless";
import { Config } from "./config";

export const endpointKey = "ED_ENDPOINT";
export const parallelismKey = "ED_PARALLELISM";
export const logTypesKey = "ED_LAMBDA_LOG_TYPES";
export const bufferSizeKey = "ED_BUFFER_SIZE";
export const retryTimeoutKey = "ED_RETRY_TIMEOUT";
export const retryIntervalKey = "ED_RETRY_INTERVAL";
export const modeKey = "ED_PUSHER_MODE";

export const tagPrefix = "ED_TAG_";

export function setEnvVarsToFunction(
  config: Config,
  func: FunctionDefinition
) {
 
  func.environment ??= {};
  const environment = func.environment as any;
  
  if (environment[endpointKey] === undefined) {
    environment[endpointKey] = config.edEndpoint;
    environment[modeKey] = "http";
  }
  if (environment[parallelismKey] === undefined && config.edParallelism !== undefined) {
    environment[parallelismKey] = config.edParallelism;
  }
  if (environment[logTypesKey] === undefined && config.logTypes !== undefined) {
    environment[logTypesKey] = config.logTypes;
  }
  if (environment[bufferSizeKey] === undefined && config.logBufferSize !== undefined) {
    environment[bufferSizeKey] = config.logBufferSize;
  }
  if (environment[retryTimeoutKey] === undefined && config.logRetryDuration !== undefined) {
    environment[retryTimeoutKey] = config.logRetryDuration;
  }
  if (environment[retryIntervalKey] === undefined && config.logRetryInterval !== undefined) {
    environment[retryIntervalKey] = config.logRetryInterval;
  }
}

export function setTagsAsEnvVariables(
  func: FunctionDefinition
) {
    func.environment ??= {};
    const environment = func.environment as any;
    const tags = func.tags ?? {};

    Object.keys(tags).forEach((key, _) => {
      const upperCaseKey = key.toUpperCase();
      environment[`${tagPrefix}${upperCaseKey}`] = tags[key];
    });
    
    environment["ED_FORWARD_ENV_VARS"] = "true";
}

export function removeEnvVarsFromFunction(func: FunctionDefinition) {
  func.environment ??= {};
  const environment = func.environment as any;
  if (environment[endpointKey] !== undefined) {
    delete environment[endpointKey];
  }
  if (environment[parallelismKey] !== undefined) {
    delete environment[parallelismKey];
  }
  if (environment[logTypesKey] !== undefined) {
    delete environment[logTypesKey];
  }
  if (environment[bufferSizeKey] !== undefined) {
    delete environment[bufferSizeKey];
  }
  if (environment[retryTimeoutKey] !== undefined) {
    delete environment[retryTimeoutKey];
  }
  if (environment[retryIntervalKey] !== undefined) {
    delete environment[retryIntervalKey];
  }

  const tags = func.tags ?? {};
  Object.keys(tags).forEach((key, _) => {
    const upperCaseKey = key.toUpperCase();
    delete environment[`${tagPrefix}${upperCaseKey}`];
  });

  delete environment["ED_FORWARD_ENV_VARS"];
}
