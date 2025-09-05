import { createPinia } from 'pinia';

export default ({ app }) => {
    const pinia = createPinia();  // Criação do Pinia
    app.use(pinia);  // Registra o Pinia na aplicação Vue
};