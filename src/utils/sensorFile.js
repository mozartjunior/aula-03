import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const pathFile = path.join(__dirname, "..", "database", "sensores.json")

export const readSensorFile = async () => {

    try {
        
        const data = await fs.readFile(pathFile,'utf-8');
        const dataJson = JSON.parse(data);
        return dataJson
    } catch (error) {
        console.log(error)
        throw new Error("Erro ao ler json de sensores")
    }

}

export const writeSensorFile = async (sensor) => {
    // Sensor vem JSON;
    try {
        const data = JSON.stringify(sensor, null, 2);
        await fs.writeFile(pathFile, data)

    } catch (error) {
        throw new Error("Erro ao escrever no json de sensores")
    }
}