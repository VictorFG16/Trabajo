import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-progress-gauge',
  templateUrl: './progress-gauge.component.html',
  styleUrls: ['./progress-gauge.component.css']
})
export class ProgressGaugeComponent implements AfterViewInit, OnDestroy {
  @Input() progress: number = 0;
  @ViewChild('gaugeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    this.tryCreateGauge();
  }

  ngOnChanges() {
    this.tryCreateGauge();
  }

  tryCreateGauge() {
    if (this.initialized && this.canvasRef?.nativeElement && this.progress !== undefined) {
      this.createGauge();
    }
  }

  createGauge() {
    const canvas = this.canvasRef.nativeElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const porcentage = this.progress >= 7 ? 100 : (this.progress / 7) * 100;
    const remaining = 100 - porcentage;

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Días restantes', 'Días usados'],
        datasets: [{
          data: [porcentage, remaining],
          backgroundColor: [this.getColor(this.progress), '#e0e0e0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${Number(context.raw).toFixed(1)}%`;
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getColor(progress: number): string {
    if (progress <= 0.49) return 'red';
    else if (progress <= 0.99) return 'yellow';
    else if (progress <= 7) return 'green';
    return 'red';
  }
}