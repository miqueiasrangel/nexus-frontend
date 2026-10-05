import { useState } from "react";
import api from "../services/api";
import "./Importacao.css";

function formatarDetalhe(detalhe) {
  if (typeof detalhe === "string") return detalhe;

  if (detalhe?.tipo === "registro_secundario_ignorado") {
    const pessoa = detalhe.matricula
      ? `Matrícula ${detalhe.matricula}${detalhe.nome ? ` (${detalhe.nome})` : ""}`
      : "Registro";
    return `${pessoa}: ${detalhe.campo} secundário ignorado — método escolhido: ${detalhe.metodoEscolhido || "desconhecido"}; método ignorado: ${detalhe.metodoIgnorado || "desconhecido"}; valor escolhido: ${detalhe.valorEscolhido || "vazio"}; valor ignorado: ${detalhe.valorIgnorado || "vazio"}`;
  }

  if (detalhe?.campo) {
    const pessoa = detalhe.matricula
      ? `Matrícula ${detalhe.matricula}${detalhe.nome ? ` (${detalhe.nome})` : ""}`
      : "Registro";
    return `${pessoa}: ${detalhe.campo} divergente — atual: ${detalhe.atual || "vazio"}; novo: ${detalhe.novo || "vazio"}`;
  }

  if (detalhe?.dispositivo) {
    return `${detalhe.dispositivo}: ${detalhe.mensagem || detalhe.motivo || "falha desconhecida"}`;
  }

  return detalhe?.motivo || JSON.stringify(detalhe);
}

export default function Importacao() {
  const [baseCsv, setBaseCsv] = useState(null);
  const [modoSimulacao, setModoSimulacao] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!baseCsv) {
      setResultado({
        status: "falhou",
        erro: "Selecione a base cadastral Excel ou CSV do SEST."
      });
      return;
    }

    const formData = new FormData();
    formData.append("base", baseCsv);
    formData.append("dryRun", String(modoSimulacao));

    try {
      setLoading(true);
      setResultado(null);

      const response = await api.post("/sincronizacoes/sest", formData);
      setResultado(response.data);
    } catch (error) {
      console.error("Erro na sincronização:", error);
      setResultado(
        error.response?.data || {
          status: "falhou",
          erro: "Erro ao conectar com o servidor."
        }
      );
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

  function metricValue(container, field) {
    if (!container) return 0;
    return container[field] ?? 0;
  }

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <div className="brand">
            <div className="logo-title-row">
              <img
                src="/logonexus.png"
                alt="Nexus Logo"
                className="logo"
                onError={(event) => {
                  event.target.style.display = "none";
                }}
              />
              <h1>NEXUS</h1>
            </div>
            <span className="badge-tag">Sincronização SEST</span>
          </div>
          <p className="subtitle">
            Envie a planilha semanal. O sistema coleta os dois REPs e atualiza
            PostgreSQL e Google Sheets em uma única operação.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <div className="upload-grid">
            <div className={"file-dropzone " + (baseCsv ? "active" : "")}>
              <div className="icon-wrapper">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <label htmlFor="file-base" className="dropzone-label">
                <span className="title">Base semanal SEST (Excel)</span>
                <span className="desc">
                  Arquivo LISTA DASS com CHAPA, NOME, COD_SETOR, NOME_SETOR e GESTOR
                </span>
              </label>
              <input
                id="file-base"
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                onChange={(event) => setBaseCsv(event.target.files[0] || null)}
              />
              {baseCsv ? (
                <div className="file-info">
                  <span className="file-name">✓ {baseCsv.name}</span>
                  <span className="file-size">
                    {formatFileSize(baseCsv.size)}
                  </span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => setBaseCsv(null)}
                  >
                    remover
                  </button>
                </div>
              ) : (
                <span className="browse-btn">Selecionar planilha semanal</span>
              )}
            </div>
          </div>

          <label className="execution-option" htmlFor="modo-simulacao">
            <input
              id="modo-simulacao"
              type="checkbox"
              checked={modoSimulacao}
              onChange={(event) => setModoSimulacao(event.target.checked)}
            />
            <span>
              <strong>Somente validar primeiro</strong>
              <small>
                Coleta os REPs e mostra as alterações sem gravar PostgreSQL ou
                Google Sheets.
              </small>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !baseCsv}
            className="submit-btn"
          >
            {loading ? (
              <span className="loading-state">
                <span className="spinner" />
                {modoSimulacao
                  ? "Validando planilha e REPs..."
                  : "Coletando REPs e sincronizando..."}
              </span>
            ) : (
              modoSimulacao ? "Validar sincronização" : "Sincronizar SEST"
            )}
          </button>
        </form>

        {resultado && (
          <div className="resultado-container">
            <div className="status-banner">
              <div>
                <h2>{resultado.mensagem || resultado.erro || "Resultado"}</h2>
                <p>
                  Status: <strong>{resultado.status || "desconhecido"}</strong>
                </p>
              </div>
              {resultado.cruzamento && (
                <p>
                  Base:{" "}
                  <strong>{resultado.cruzamento.totalBase ?? 0}</strong>
                  {" | "}Com REP:{" "}
                  <strong>{resultado.cruzamento.totalComREP ?? 0}</strong>
                  {" | "}Sem REP:{" "}
                  <strong>{resultado.cruzamento.totalSemREP ?? 0}</strong>
                </p>
              )}
            </div>

            {resultado.banco && (
              <div className="stats-grid">
                <div className="stat-card postgres">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="status-dot green" />
                      <h3>Lista de funcionários</h3>
                    </div>
                    <span className="total-badge">
                      {metricValue(resultado.banco.lista_funcionario, "total")}{" "}
                      total
                    </span>
                  </div>
                  <div className="metrics-grid">
                    <div className="metric inseridos">
                      <span className="label">Inseridos</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.lista_funcionario,
                          "inseridos"
                        )}
                      </span>
                    </div>
                    <div className="metric atualizados">
                      <span className="label">Atualizados</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.lista_funcionario,
                          "atualizados"
                        )}
                      </span>
                    </div>
                    <div className="metric ignorados">
                      <span className="label">Ignorados</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.lista_funcionario,
                          "ignorados"
                        )}
                      </span>
                    </div>
                    <div className="metric erros">
                      <span className="label">Removidos</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.lista_funcionario,
                          "removidos"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="stat-card postgres">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="status-dot green" />
                      <h3>Dados dos REPs</h3>
                    </div>
                    <span className="total-badge">
                      {metricValue(resultado.banco.colaboradores, "total")}{" "}
                      total
                    </span>
                  </div>
                  <div className="metrics-grid">
                    <div className="metric inseridos">
                      <span className="label">Inseridos</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.colaboradores,
                          "inseridos"
                        )}
                      </span>
                    </div>
                    <div className="metric atualizados">
                      <span className="label">Atualizados</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.colaboradores,
                          "atualizados"
                        )}
                      </span>
                    </div>
                    <div className="metric ignorados">
                      <span className="label">Ignorados</span>
                      <span className="val">
                        {metricValue(
                          resultado.banco.colaboradores,
                          "ignorados"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="stat-card sheets">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="status-dot blue" />
                      <h3>Google Sheets</h3>
                    </div>
                    <span className="total-badge">
                      {resultado.planilha?.total ?? 0} total
                    </span>
                  </div>
                  {resultado.planilha?.erro || resultado.planilha?.aviso ? (
                    <div className="alert-box warning">
                      {resultado.planilha.erro || resultado.planilha.aviso}
                    </div>
                  ) : (
                    <div className="metrics-grid">
                      <div className="metric inseridos">
                        <span className="label">Inseridos</span>
                        <span className="val">
                          {metricValue(resultado.planilha, "inseridos")}
                        </span>
                      </div>
                      <div className="metric atualizados">
                        <span className="label">Atualizados</span>
                        <span className="val">
                          {metricValue(resultado.planilha, "atualizados")}
                        </span>
                      </div>
                      <div className="metric ignorados">
                        <span className="label">Ignorados</span>
                        <span className="val">
                          {metricValue(resultado.planilha, "ignorados")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {resultado.inconsistencias && (
              <>
                <div className="alert-box warning">
                  Registros do REP sem correspondência na base:{" "}
                  {resultado.inconsistencias.registrosSemBase?.length ?? 0}
                  {" | "}Linhas inválidas dos REPs:{" "}
                  {resultado.inconsistencias.linhasREPInvalidas?.length ?? 0}
                </div>
                {(resultado.inconsistencias.divergenciasResolvidas?.length ?? 0) > 0 && (
                  <div className="alert-box warning">
                    <strong>Divergências resolvidas automaticamente:</strong>
                    <ul>
                      {resultado.inconsistencias.divergenciasResolvidas.map(
                        (detalhe, indice) => (
                          <li key={indice}>{formatarDetalhe(detalhe)}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}

            {resultado.detalhes && (
              <div className="alert-box warning">
                <strong>Detalhes da falha:</strong>
                <ul>
                  {(Array.isArray(resultado.detalhes)
                    ? resultado.detalhes
                    : [resultado.detalhes]
                  ).map((detalhe, indice) => (
                    <li key={indice}>{formatarDetalhe(detalhe)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
