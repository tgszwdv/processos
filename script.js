const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

async function scrapeData() {
    try {
        const { data } = await axios.get('https://selecao-login.app.ufgd.edu.br/');
        const $ = cheerio.load(data);

        const processos = [];
        $('tr[ng-repeat="processo in ctrl.inscricoesAbertas track by $index"]').each((i, row) => {
            const cells = $(row).find('td');
            const titulo = $(cells[0]).text().trim();
            const descricao = $(cells[1]).text().trim();
            const periodo = $(cells[2]).text().trim();
            const editalUrl = $(cells[3]).find('a').attr('href');
            const paginaUrl = $(cells[4]).find('a').attr('href');

            processos.push({
                titulo: titulo,
                descricao: descricao,
                periodo: periodo,
                url: paginaUrl,
                edital: editalUrl
            });
        });

        fs.writeFileSync('data/processos.json', JSON.stringify(processos, null, 2));
    } catch (error) {
        console.error('Erro ao fazer scraping:', error);
    }
}

scrapeData();
