export interface VersionTask {
  id: number;
  versionId: number;
  titulo: string;
  tipo: string;
  statusPlanejamento: string;
  mergeRealizado: boolean;
  possuiScript: boolean;
  possuiTagVersao: boolean;
}
