//Archivo de configuracion para saber si usar el entorno de desarrollo o el de produccion

const isProduction = false; // Cambia a `true` cuando estés en producción

const config = {
    apiUrl: isProduction ? 'https://pokemondex-hz6s.onrender.com' : 'http://localhost:5000',
};

export default config;
