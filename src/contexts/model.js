import React, { createContext, useEffect, useState } from "react";
import { loadModel } from "../services/chipRecognition";

export const ModelContext = createContext({
  model: null,
  loading: true,
});

export function ModelProvider({ children }) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    (async () => {
      let loadedModel = await loadModel();
      setModel(loadedModel);
    })();
  }, []);

  return (
    <ModelContext.Provider value={{ model }}>{children}</ModelContext.Provider>
  );
}
