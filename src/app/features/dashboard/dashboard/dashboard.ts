import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ChartOptions } from 'chart.js';
import { startOfDay } from 'date-fns';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardResponse } from '../../../core/models/dashboard.model';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CalendarModule],
  providers: [{
    provide: DateAdapter,
    useFactory: adapterFactory
  }],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  data: DashboardResponse | null = null;
  chartData: any = null;

  totalConfirmadas = 0;
  totalDesejaveis = 0;
  totalSemQa = 0;

  selectedPeriod = 30;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();


  constructor(private service: DashboardService) {
  }

  ngOnInit(): void {
    this.load();
  }

  events = [
    {
      start: startOfDay(new Date()),
      title: '🚀 Deploy 3.63.1.0',
      color: {
        primary: '#22c55e',
        secondary: 'rgba(34,197,94,0.2)'
      }
    },
    {
      start: startOfDay(new Date()),
      title: '🧪 Teste pendente',
      color: {
        primary: '#facc15',
        secondary: 'rgba(250,204,21,0.2)'
      }
    }
  ];

  load() {
    this.service.getDashboard().subscribe({
      next: (res) => {
        this.data = res;
        this.buildChart();
        this.calculateTotals();
      },
      error: (err) => console.error(err)
    });
  }

  //CALCULO

  calculateTotals() {
    if (!this.data?.versions) return;

    this.totalConfirmadas = this.data.versions.reduce((a: number, b: any) => a + b.confirmadas, 0);
    this.totalDesejaveis = this.data.versions.reduce((a: number, b: any) => a + b.desejaveis, 0);
    this.totalSemQa = this.data.versions.reduce((a: number, b: any) => a + b.semQA, 0);
  }

  buildChart() {
    if (!this.data?.versions?.length) return;

    const sorted = [...this.data.versions].sort((a, b) =>
      a.numeroVersao.localeCompare(b.numeroVersao, undefined, { numeric: true })
    );

    const labels = sorted.map(v => v.numeroVersao);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Confirmadas',
          data: sorted.map(v => v.confirmadas),
          backgroundColor: 'rgba(34,197,94,0.6)',
          borderColor: '#22c55e',
          fill: true,
          tension: 0.4,
          stack: 'stack1'
        },
        {
          label: 'Desejáveis',
          data: sorted.map(v => v.desejaveis),
          backgroundColor: 'rgba(250,204,21,0.6)',
          borderColor: '#facc15',
          fill: true,
          tension: 0.4,
          stack: 'stack1'
        },
        {
          label: 'Sem QA',
          data: sorted.map(v => v.semQA),
          backgroundColor: 'rgba(239,68,68,0.6)',
          borderColor: '#ef4444',
          fill: true,
          tension: 0.4,
          stack: 'stack1'
        },

        // 🔥 NOVO (QUALIDADE)
        {
          label: 'Qualidade (%)',
          data: sorted.map(v => v.percentualConfirmadas),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56,189,248,0.2)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1' // 👉 eixo separado
        }
      ]
    };
  }

  getRiskClass(risco: string) {
    return risco?.toLowerCase();
  }

  setPeriod(days: number) {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - days);

    this.service.getDashboard(
      inicio.toISOString(),
      fim.toISOString()
    ).subscribe({
      next: (res) => {
        this.data = res;
        this.buildChart();
      },
      error: (err) => {
        console.error('Erro ao filtrar período', err);
      }
    });
  }

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        labels: { color: '#cbd5f5' }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#94a3b8' }
      },
      y: {
        stacked: true,
        ticks: { color: '#94a3b8' }
      },
      y1: {
        position: 'right',
        ticks: { color: '#38bdf8' },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  getSaude(): string {
    const versions = this.data?.versions || [];

    const total = versions.length;
    const vermelhas = versions.filter(v => v.indicadorRisco === 'Vermelho').length;
    const amarelas = versions.filter(v => v.indicadorRisco === 'Amarelo').length;

    const percVermelho = (vermelhas / total) * 100;

    if (percVermelho >= 30) return 'Crítica';
    if (amarelas > 0 || vermelhas > 0) return 'Atenção';
    return 'Saudável';
  }

  getUltimaVersao() {
    return this.data?.versions?.[0];
  }

  getVersoesRiscoAlto(): number {
    return this.data?.versions?.filter(v => v.indicadorRisco === 'Vermelho').length || 0;
  }

  getAlertas() {
    return this.data?.versions?.filter(v =>
      v.indicadorRisco === 'Vermelho' ||
      v.semQA > 0 ||
      v.semMerge > 0
    );
  }

  getRiscoPrevisto(v: any): string {
    if (v.semMerge > 2) return 'Alto';
    if (v.semQA > 0) return 'Médio';
    return 'Baixo';
  }
}
