import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persist-uni';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export * from "./modules/user";

export default pinia
