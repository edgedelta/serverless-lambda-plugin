import Service from "serverless/classes/Service";

export interface Config {
  enabled?: boolean;
  // operation values are add and remove. Defaults to add.
  operation?: string;
  // Hosted agents endpoint. Required if operation is add.
  edEndpoint?: string;
  // Determines the count of streamer goroutines to consume logs. Default is 4.
  edParallelism?: number;
  // Which types of logs you want to get from Lambda Funcion.
  // Options are function,platform,extension. Default is function,platform.
  logTypes?: string;
  // Buffer size of the log channel before it block newly arrived logs. Default is 100.
  logBufferSize?: number;
  // Total duration for which to keep retry. Default is 0. This is a time.Duration() value.
  logRetryDuration?: string;
  // RetryInterval is the initial interval to wait until next retry.
  // It is increased exponentially until timeout limit is reached. Default is 0 which means no retries.
  logRetryInterval?: string;
  // When set, this plugin will not add extensions to these functions.
  excludeFunctions?: string[];
}

export function getConfig(service: Service): Config {
  let custom = service.custom as any;
  if (custom === undefined) {
    custom = {
      operation: "add",
      enabled: true,
    };
  }

  let edgedelta = custom.edgedelta as Partial<Config> | undefined;
  if (edgedelta === undefined) {
    edgedelta = {};
  }

  const config: Config = {
    ...edgedelta,
  };
  return config;
}
