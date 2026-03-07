export interface Version {
  id: number;
  numeroVersao: string;
  statusVersao: string;
  dataLimiteTarefas?: string;
  dataPrevistaLiberacao?: string;
  dataLiberacaoReal?: string;
  observacoes?: string;
  criadoPor?: string;
  totalTarefas?: number;
  percentualConclusao?: number;
  confirmadas?: number
  desejaveis?: number
  planejadas?: number
}
