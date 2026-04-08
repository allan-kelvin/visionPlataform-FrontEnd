export interface DashboardVersion {
  versionId: number;
  numeroVersao: string;
  status: string;
  totalTarefas: number;
  confirmadas: number;
  desejaveis: number;
  semQA: number;
  semMerge: number;
  percentualConfirmadas: number;
  percentualDesejaveis: number;
  indicadorRisco: string;
}

export interface DashboardSummary {
  totalVersions: number;
  emPlanejamento: number;
  emTestes: number;
  liberadas: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  versions: DashboardVersion[];
}
