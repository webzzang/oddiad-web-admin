import { Component, OnInit, Input, Output, OnChanges, Inject, ElementRef, EventEmitter, ChangeDetectionStrategy, ViewChild}  from '@angular/core';         
import { Chart } from 'chart.js';
import { DOCUMENT } from '@angular/common'; 
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-ng2-chart',
  templateUrl: './ng2-chart.component.html',
  styleUrls: ['./ng2-chart.component.scss']
})
export class Ng2ChartComponent implements OnInit {

  uniqueId = Utils.uuid();
  
  @Input() chartDataSets = [];
  @Input() chartLabels = [];
  @Input() chartOptions = {};
  @Input() chartPlugins = [];
  @Input() chartType;
  @Input() chartLegend : boolean;

  @Output() changeView = new EventEmitter();

  @ViewChild('commonCanvas') commonCanvas: ElementRef;

  chart: any;

  constructor(@Inject(DOCUMENT) document ) {
    document.getElementById('el');
  }

  ngOnInit(): void {
    console.log(`Ng2ChartComponent ngOnInit`);
    this.drawChart();
  }

  ngOnChanges() {
    console.log("Ng2ChartComponent ngOnChanges >> ");
    this.drawChart();      
  }

  ngAfterViewInit(): void {
    console.log(`Ng2ChartComponent ngAfterViewInit`);
  }

  drawChart() {
    console.log(`Ng2ChartComponent drawChart >> ` + this.chartType);

    if(this.chartType == undefined) {
      return;
    }

    if(this.chart) {
      this.chart.update();
      this.chart.destroy();
    }

    if(this.chartType == 'line') {
    
      console.log(`Ng2ChartComponent drawChart line >> chartDataSets{} `, this.chartDataSets);
      
      this.chart = new Chart(this.commonCanvas.nativeElement.getContext('2d'), {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: this.chartDataSets
        },
        options: this.chartOptions
      });

    } else if(this.chartType == 'bar') {

      console.log(`Ng2ChartComponent drawChart bar`);

      this.chart = new Chart(this.commonCanvas.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels:this.chartLabels,
          datasets: this.chartDataSets
        },
        options: this.chartOptions
      });

    } else if(this.chartType == 'pie') {

      console.log(`Ng2ChartComponent drawChart pie`);

      this.chart = new Chart(this.commonCanvas.nativeElement.getContext('2d'), {
        type: 'pie',
        data: {
          labels:this.chartLabels,
          datasets: this.chartDataSets
        },
        options: this.chartOptions
      });
      
    } else if(this.chartType == 'doughnut') {
      console.log(`Ng2ChartComponent drawChart doughnut`);

      this.chart = new Chart(this.commonCanvas.nativeElement.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels:this.chartLabels,
          datasets: this.chartDataSets
        },
        options: this.chartOptions
      });      
    }
  }
}
