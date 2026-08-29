import { useState } from "react";
import api from "../services/api";
import "./Importacao.css";

export default function Importacao() {
  const [csv1, setCsv1] = useState(null);
  const [csv2, setCsv2] = useState(null);
  const [xls, setXls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if ((!csv1 && !csv2) || !xls) {
      alert("Por favor, selecione pelo menos um arquivo CSV/TXT e o arquivo XLSX.");
      return;
    }

    const formData = new FormData();
    if (csv1) formData.append("csv", csv1);
    if (csv2) formData.append("csv2", csv2);
    formData.append("xls", xls);

    try {
      setLoading(true);
      setResultado(null);

      const response = await api.post("/importar", formData);
      setResultado(response.data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor para importar os arquivos.");
    } finally {
      setLoading(false);
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="container">
      <div className="card">
        {/* CABEÇALHO DA APLICAÇÃO */}
        <header className="header">
          <div className="brand">
            <div className="logo-title-row">
              <img src="/logonexus.png" alt="Nexus Logo" className="logo" onError={(e) => { e.target.style.display = 'none'; }} />
              <h1>NEXUS</h1>
            </div>
            <span className="badge-tag">Automação Multi-Lista & Sincronização</span>
          </div>
          <p className="subtitle">
            Cruzamento inteligente de listas e sincronização simultânea com PostgreSQL e Google Sheets.
          </p>
        </header>

        {/* FORMULÁRIO DE SELEÇÃO DE ARQUIVOS */}
        <form onSubmit={handleSubmit} className="form">
          <div className="upload-grid triple">
            {/* SELETOR CSV 1 */}
            <div className={`file-dropzone ${csv1 ? "active" : ""}`}>
              <div className="icon-wrapper">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <label htmlFor="file-csv1" className="dropzone-label">
                <span className="title">CSV / TXT (Lista 1)</span>
                <span className="desc">Primeira lista de ponto / catraca *</span>
              </label>
              <input
                id="file-csv1"
                type="file"
                onChange={(e) => setCsv1(e.target.files[0] || null)}
              />
              {csv1 ? (
                <div className="file-info">
                  <span className="file-name">✓ {csv1.name}</span>
                  <span className="file-size">{formatFileSize(csv1.size)}</span>
                  <button type="button" className="remove-file-btn" onClick={() => setCsv1(null)}>remover</button>
                </div>
              ) : (
                <span className="browse-btn">Selecionar Arquivo 1</span>
              )}
            </div>

            {/* SELETOR CSV 2 (OPCIONAL) */}
            <div className={`file-dropzone ${csv2 ? "active" : ""}`}>
              <div className="icon-wrapper optional">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>
              <label htmlFor="file-csv2" className="dropzone-label">
                <span className="title">CSV / TXT (Lista 2)</span>
                <span className="desc">Segunda lista extra (Opcional)</span>
              </label>
              <input
                id="file-csv2"
                type="file"
                onChange={(e) => setCsv2(e.target.files[0] || null)}
              />
              {csv2 ? (
                <div className="file-info">
                  <span className="file-name">✓ {csv2.name}</span>
                  <span className="file-size">{formatFileSize(csv2.size)}</span>
                  <button type="button" className="remove-file-btn" onClick={() => setCsv2(null)}>remover</button>
                </div>
              ) : (
                <span className="browse-btn secondary">Adicionar Arquivo 2</span>
              )}
            </div>

            {/* SELETOR XLSX */}
            <div className={`file-dropzone ${xls ? "active" : ""}`}>
              <div className="icon-wrapper xls">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <rect x="8" y="12" width="8" height="6" rx="1"></rect>
                </svg>
              </div>
              <label htmlFor="file-xls" className="dropzone-label">
                <span className="title">Excel (XLSX / XLS)</span>
                <span className="desc">Base principal de funcionários *</span>
              </label>
              <input
                id="file-xls"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setXls(e.target.files[0] || null)}
              />
              {xls ? (
                <div className="file-info">
                  <span className="file-name">✓ {xls.name}</span>
                  <span className="file-size">{formatFileSize(xls.size)}</span>
                  <button type="button" className="remove-file-btn" onClick={() => setXls(null)}>remover</button>
                </div>
              ) : (
                <span className="browse-btn">Selecionar Excel</span>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading || (!csv1 && !csv2) || !xls} className="submit-btn">
            {loading ? (
              <span className="loading-state">
                <span className="spinner"></span> Cruzando dados e sincronizando...
              </span>
            ) : (
              "Iniciar Cruzamento de Listas & Sincronização"
            )}
          </button>
        </form>

        {/* ÁREA DE EXIBIÇÃO DE RESULTADOS */}
        {resultado && (
          <div className="resultado-container">
            <div className="status-banner">
              <h2>{resultado.mensagem || "Processamento Concluído"}</h2>
              <p>Total de funcionários únicos cruzados: <strong>{resultado.totalProcessados ?? 0}</strong></p>
            </div>

            <div className="stats-grid">
              {/* CARD POSTGRESQL */}
              <div className="stat-card postgres">
                <div className="card-header">
                  <div className="card-title">
                    <span className="status-dot green"></span>
                    <h3>Banco de Dados</h3>
                  </div>
                  <span className="total-badge">{resultado.banco?.total ?? resultado.totalProcessados ?? 0} total</span>
                </div>

                {resultado.banco ? (
                  <div className="metrics-grid">
                    <div className="metric inseridos">
                      <span className="label">Inseridos</span>
                      <span className="val">{resultado.banco.inseridos ?? 0}</span>
                    </div>

                    <div className="metric atualizados">
                      <span className="label">Atualizados</span>
                      <span className="val">{resultado.banco.atualizados ?? 0}</span>
                    </div>

                    <div className="metric ignorados">
                      <span className="label">Ignorados</span>
                      <span className="val">{resultado.banco.ignorados ?? 0}</span>
                    </div>

                    <div className="metric erros">
                      <span className="label">Erros</span>
                      <span className="val">{resultado.banco.erros ?? 0}</span>
                    </div>
                  </div>
                ) : (
                  <p className="no-data">Nenhum dado retornado do banco.</p>
                )}
              </div>

              {/* CARD GOOGLE SHEETS */}
              <div className="stat-card sheets">
                <div className="card-header">
                  <div className="card-title">
                    <span className="status-dot blue"></span>
                    <h3>Google Sheets</h3>
                  </div>
                  {resultado.planilha && !resultado.planilha.erro && !resultado.planilha.aviso && (
                    <span className="total-badge">{resultado.planilha.total ?? (resultado.planilha.inseridos + resultado.planilha.atualizados + resultado.planilha.ignorados) ?? 0} total</span>
                  )}
                </div>

                {resultado.planilha ? (
                  resultado.planilha.erro ? (
                    <div className="alert-box error">
                      <strong>Erro de Conexão:</strong> {resultado.planilha.erro}
                    </div>
                  ) : resultado.planilha.aviso ? (
                    <div className="alert-box warning">
                      <strong>Aviso:</strong> {resultado.planilha.aviso}
                    </div>
                  ) : (
                    <div className="metrics-grid">
                      <div className="metric inseridos">
                        <span className="label">Inseridos</span>
                        <span className="val">{resultado.planilha.inseridos ?? 0}</span>
                      </div>

                      <div className="metric atualizados">
                        <span className="label">Atualizados</span>
                        <span className="val">{resultado.planilha.atualizados ?? 0}</span>
                      </div>

                      <div className="metric ignorados">
                        <span className="label">Ignorados</span>
                        <span className="val">{resultado.planilha.ignorados ?? 0}</span>
                      </div>

                      <div className="metric erros">
                        <span className="label">Erros</span>
                        <span className="val">{resultado.planilha.erros ?? 0}</span>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="no-data">Planilha não sincronizada.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
