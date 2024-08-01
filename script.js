document.addEventListener('DOMContentLoaded', () => {
  fetch('processos.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('processos-container');

      // Gera o HTML para cada processo
      const html = data.map(processo => `
        <div class="processo">
          <h2>${processo.titulo}</h2>
          <p>${processo.descricao}</p>
          <p><strong>Período:</strong> ${processo.periodo}</p>
          <p><a href="${processo.edital}" target="_blank">Edital</a></p>
          <p><a href="${processo.pagina}" target="_blank">Página</a></p>
        </div>
      `).join('');

      container.innerHTML = html;
    })
    .catch(error => console.error('Erro ao carregar processos.json:', error));
});
