import { Config } from "config";
import { FunctionDefinition } from "serverless";
import Service from "serverless/classes/Service";
import { setEnvVarsToFunctions, removeEnvVarsFromFunction } from "./env-variables";

export const X86_64_ARCHITECTURE = "x86_64";
export const ARM64_ARCHITECTURE = "arm64";
export const DEFAULT_ARCHITECTURE = X86_64_ARCHITECTURE;

export interface Extension {
  regions: {
    [region: string]:
      | {
          [arch: string]: string | undefined;
        }
      | undefined;
  };
}

export function addExtension(service: Service, functions: FunctionDefinition[], availableExtensions: Extension, config: Config) {
  const { region } = service.provider;
  const regionArchs = availableExtensions.regions[region];
  if (regionArchs === undefined) {
    return;
  }

  for (const func of functions) {
    const architecture =
      (func as any).architecture ?? (service.provider as any).architecture ?? DEFAULT_ARCHITECTURE;
    const extensionLayerARN: string | undefined = regionArchs[architecture];
    if (extensionLayerARN) {
        removeLayer(service, func, extensionLayerARN);
        addLayer(service, func, extensionLayerARN);
        console.log("Adding env variables");
        setEnvVarsToFunctions(config, functions);
    }
  }
}

export function removeExtension(service: Service, functions: FunctionDefinition[], availableExtensions: Extension) {
    const { region } = service.provider;
    const regionArchs = availableExtensions.regions[region];
    if (regionArchs === undefined) {
      return;
    }
    for (const func of functions) {
      const architecture =
        (func as any).architecture ?? (service.provider as any).architecture ?? DEFAULT_ARCHITECTURE;
      const extensionLayerARN: string | undefined = regionArchs[architecture];
      if (extensionLayerARN) {
          removeLayer(service, func, extensionLayerARN);
          removeEnvVarsFromFunction(func);
      }
    }
}

function addLayer(service: Service, func: FunctionDefinition, layerArn: string) {
    const currentLayersFunc = ((func as any).layers as string[] | string[]) || [];
    const currentLayersService = ((service.provider as any).layers as string[] | string[]) || [];
    let layerSet : Set<string>
    if (currentLayersFunc.length > 0 || currentLayersService.length === 0) {
      layerSet = new Set(currentLayersFunc);
    } else {
      layerSet = new Set(currentLayersService);
    }
    layerSet.add(layerArn);
    (func as any).layers = Array.from(layerSet);
}


function removeLayer(service: Service, func: FunctionDefinition, previousLayer: string) {
  const currentLayersFunc = ((func as any).layers as string[] | string[]) || [];
  const currentLayersService = ((service.provider as any).layers as string[] | string[]) || [];
  let currentLayers : string[] = [];
  if (currentLayersFunc.length > 0 || currentLayersService.length === 0) {
    currentLayers = currentLayersFunc;
  } else {
    currentLayers = currentLayersService;
  }
  if (new Set(currentLayers).has(previousLayer!)) {
    currentLayers = currentLayers?.filter((layer) => layer !== previousLayer);
  }
  (func as any).layers = currentLayers;
}