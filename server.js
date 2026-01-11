const http = require("node:http");

const PORT = 5050;

const sensores = [
	{
		id: "SNN-001",
		localizacao: "Note Superior",
	},
	{
		id: "SNN-002",
		localizacao: "Sul Superior",
	},
];

// Criar o servidor
const server = http.createServer((req, res) => {
	// Configurando cabeçalho de resposta
	// res.writeHead(200, { "content-type": "text/plain" } )
	// res.end("Testando v2")

	const { method, url } = req;

	// '1' == 1

	// se  ... && ...
	if (method === "GET" && url === "/status") {
		console.log(` METODO:${method} : URL ${url} `);
		res.writeHead(200, { "Content-type": "text/plain" });
		res.end("Sistema operacional!");
	} else if (method === "GET" && url === "/sensores") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify(sensores));
	}

	// POST
	else if (method === "POST" && url === "/data") {
		let body = "";

		req.on("data", (chunk) => {
			console.log(chunk);
			body += chunk;
		});

		req.on("end", () => {
			const dataJson = JSON.parse(body);
			sensores.push(dataJson);
			res.writeHead(200, { "content-type": "application/json" });
			res.end(JSON.stringify({ status: "created", data: dataJson }));
		});
	} else if (method === "DELETE" && url.startsWith("/remover/")) {
		("   / remover / ");
		const _id = url.split("/")[2];
	} else {
		res.writeHead(404, { "Content-type": "text/plain" });
		res.end("Rota não foi encontrada!");
	}

	// Respondendo a requisdwwdsição.
});

// Iniciar o servidor
server.listen(PORT, () => {
	console.log(`Servidor rodando na porta: ${PORT}`);
});