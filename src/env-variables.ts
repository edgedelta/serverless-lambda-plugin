import { FunctionDefinition } from "serverless";
import { Config } from "./config";

export const endpointKey = "ED_ENDPOINT";
export const parallelismKey = "ED_PARALLELISM";
export const logTypesKey = "ED_LAMBDA_LOG_TYPES";
export const bufferSizeKey = "ED_BUFFER_SIZE";
export const retryTimeoutKey = "ED_RETRY_TIMEOUT";
export const retryIntervalKey = "ED_RETRY_INTERVAL";

export function setEnvVarsToFunctions(
  config: Config,
  functions: FunctionDefinition[]
) {
  functions.forEach((handler) => {
    handler.environment ??= {};
    const environment = handler.environment as any;
    
    if (environment[endpointKey] === undefined) {
      environment[endpointKey] = config.edEndpoint;
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
  });
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
}
