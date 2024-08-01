const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://selecao.ufgd.edu.br/', { waitUntil: 'networkidle2' });

  // Extraindo os dados
  const processos = await page.evaluate(() => {
    // Função para extrair o texto ou URL
    const extractText = (element) => element ? element.innerText.trim() : '';
    const extractHref = (element) => element ? element.href : '';

    // Selecionando todas as linhas da tabela
    const rows = Array.from(document.querySelectorAll('table tbody tr'));

    // Mapeando as linhas para um array de objetos
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        titulo: extractText(cells[0]),
        descricao: extractText(cells[1]),
        periodo: extractText(cells[2]),
        edital: extractHref(cells[3].querySelector('a')),
        pagina: extractHref(cells[4].querySelector('a'))
      };
    });
  });

  console.log(JSON.stringify(processos, null, 2)); // Formata e imprime o JSON

  await browser.close();
})();
