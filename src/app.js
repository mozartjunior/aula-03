import express from 'express';
import { readSensorFile, writeSensorFile } from './utils/sensorFile.js';

// Express
const app = express();

// Habilitando json;
app.use(express.json())

app.get('/status', (req, res) => {
res.status(200).send('Sistema do Polo Industrial funcionando');
});

app.get('/fabrica', (req, res) => {
res.status(200).send('Polo Industrial - Unidade Manaus');
});

app.get('/maquinas', (req, res) => {
res.status(200).send('Maquinas em operacao: 24');
});

app.get('/dados', (req, res) => {
const dados = {
empresa: 'Polo Industrial',
cidade: 'Manaus',
status: 'Operando',
maquinasAtivas: 24,
funcionarios: 120,
turnoAtual: 'Manhã'
};
res.status(200).json(dados);
});

app.get('/relatorio', (req, res) => {
const agora = new Date();
const relatorio = {
data: agora.toLocaleDateString(),
hora: agora.toLocaleTimeString(),
statusGeral: 'Operação normal',
mensagem: 'Todos os sistemas estão funcionando corretamente'
};
res.status(200).json(relatorio);
});

app.use((_req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, bypass-tunnel-reminder",
	);
	next();
});

// Lista de Sensores
app.get('/api/v1/status', (req, res) => {
    res.status(200).json({ message: "Servidor Operante!" })
});

app.get('/api/v1/sensores', async (req, res) => {
	const sensores = await readSensorFile()
    res.status(200).json({ sensores: sensores })
});

app.post('/api/v1/sensores', async (req, res) => {
	try {
		const { id, localizacao, temp } = req.body;

		if (!id  ) {
			throw new Error("ID obrigatório")
		}

		// Montar objeto sensor;
		const sensor = { id, localizacao, temp };
		// pega a lista de sensores
		const sensores = await readSensorFile();
		// Verificar se o sensor já está salvo
		sensores.push(sensor);
		await writeSensorFile(sensores);
		res.status(201).json({ status: "success", data: sensor })
	} catch (error) {
		console.log(error)
		res.status(500).json({ status: "fail", message: "Error interno no servidor" })
	}
})

// Atualização e DELETE

// app.put("/api/v1/sensores/:id", async (req, res) => {
// 	// id e dados do sensor atualizado, req.params.id
// 	const { id } = req.params;
// 	const { localizacao, temp } = req.body;
// 	try {
// 		const sensores =  await readSensorFile();
// 		// Se o sensor estiver na lista, retorna o index da sua localização se não estiver retorna -1
// 		const findSensorId = sensores.findIndex( sensor => sensor.id == id);
// 		if (findSensorId === -1) {
// 			throw new Error("Sensor não está salvo na lista!");
// 		}
// 		const sensorUpdate = { id, localizacao, temp};
// 		sensores[findSensorId]  = { ...sensores[findSensorId] , ...sensorUpdate };
// 		await writeSensorFile(sensores);
// 		res.status(200).json({ message: "success", data: sensorUpdate  })
// 	} catch (error) {
// 		res.status(500).json({ status: "fail", message: "Erro interno do servidor!" })
// 	}
// })

app.put('/api/v1/sensores/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { localizacao, temp } = req.body;

		const sensores = await readSensorFile();
		const index = sensores.findIndex(sensor => sensor.id == id);

		if (index === -1) {
			return res.status(404).json({ message: "Sensor não encontrado" });
		}

		const sensorAtualizado = {
			...sensores[index],
			localizacao: localizacao ?? sensores[index].localizacao,
			temp: temp ?? sensores[index].temp
		};

		sensores[index] = sensorAtualizado;
		await writeSensorFile(sensores);

		res.status(200).json({ status: "success", data: sensorAtualizado });
	} catch (error) {
		res.status(500).json({ message: "Erro interno do servidor" });
	}
});

app.delete('/api/v1/sensores/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const sensores = await readSensorFile();

		// procura o índice do sensor
		const index = sensores.findIndex(sensor => sensor.id == id);

		if (index === -1) {
			return res.status(404).json({ message: "Sensor não encontrado" });
		}

		// remove o sensor do array
		const sensorRemovido = sensores.splice(index, 1);

		// salva o arquivo atualizado
		await writeSensorFile(sensores);

		res.status(200).json({
			status: "success",
			message: "Sensor removido com sucesso",
			data: sensorRemovido[0]
		});
	} catch (error) {
		res.status(500).json({ message: "Erro interno do servidor" });
	}
});


app.use((req, res) => {
res.status(404).send('Rota não encontrada');
});



// sensores

export default app;