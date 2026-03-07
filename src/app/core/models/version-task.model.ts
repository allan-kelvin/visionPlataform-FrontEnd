export interface VersionTask {
  id: number;
  versionId: number;
  azureTaskId: number;
  azureTaskUrl: string;
  titulo: string;
  cliente: string;
  area: string;
  tipo: 'Correcao' | 'Melhoria' | 'Alteracao';
  statusPlanejamento:
  | 'Planejado'
  | 'Desejavel'
  | 'Confirmado';
  qa: string;
  qaUserId: number | null
  mergeRealizado: boolean;
  possuiScript: boolean;
  possuiTagVersao: boolean;
}
