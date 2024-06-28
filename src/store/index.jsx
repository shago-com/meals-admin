import {createContext} from 'react';


export const GlobalStore = createContext({})
export const BaseStore = createContext({})

export const GlobalStoreProvider = GlobalStore.Provider;
export const BaseStoreProvider = BaseStore.Provider;

export default GlobalStore;