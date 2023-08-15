import { loadMaps } from "@/api";
import { BizError } from "@/error/biz-error";
import { Map } from "@/types/dto";
import { defineStore } from "pinia";

type ApiData<DataType> = {
  data: DataType;
  loaded: boolean;
  tryLoad: () => Promise<void>;
  required: boolean;
};
function defineApiData<DataKey extends string, DataType>(
  key: DataKey,
  defaultValue: DataType,
  loader: () => Promise<DataType>,
  required: boolean
): {
  [k in DataKey]: ApiData<DataType>;
} {
  const apiProps: ApiData<DataType> = {
    data: defaultValue,
    loaded: false,
    required,
    tryLoad: async () => {
      if (apiProps.loaded) {
        return;
      }
      const result = await loader();
      apiProps.data = result;
      apiProps.loaded = true;
    },
  };

  // @ts-ignore
  return {
    [key as DataKey]: apiProps,
  };
}

export const useApiStore = defineStore("apiStore", () => {
  const apiStore = {
    ...defineApiData("maps", [] as Map[], loadMaps, true),
  };

  async function loadRequiredData() {
    const loaders = Object.entries(apiStore).reduce(
      (loaders, [key, { tryLoad }]) => {
        loaders.push({
          api: key,
          tryLoad,
        });
        return loaders;
      },
      [] as Array<{ api: string; tryLoad: ApiData<any>["tryLoad"] }>
    );

    const loadDataPromises = loaders.map(async ({ api, tryLoad }) => {
      try {
        await tryLoad();
      } catch (e) {
        throw new BizError(`Failed to load api: ${api}`, { cause: e });
      }
    });

    const results = await Promise.allSettled(loadDataPromises);
    const errors = results.reduce((errors, result) => {
      if (result.status === "rejected") {
        errors.push(result.reason);
      }
      return errors;
    }, [] as BizError[]);
    if (errors.length > 0) {
      alert("failed to load required data. open console to check errors");
      console.error("failed to load required data", errors);
    }
  }

  return { ...apiStore, loadRequiredData };
});
