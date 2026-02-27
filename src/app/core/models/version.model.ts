export interface Version {
  id: number;
  numeroVersao: string;
  statusVersao: string;
  dataLimiteTarefas?: string;
  dataPrevistaLiberacao?: string;
  dataLiberacaoReal?: string;
  observacoes?: string;
}
