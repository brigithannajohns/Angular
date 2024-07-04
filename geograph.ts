import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartdataService } from '../../services/chartdata.service';
import { feature, quantize } from 'topojson';
import * as ChartGeo from 'chartjs-chart-geo'; 
import {ChoroplethController, ProjectionScale,GeoFeature, ColorScale} from 'chartjs-chart-geo'
import { Chart, CategoryScale, TooltipItem, ChartData, TooltipModel } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { geoMercator } from 'd3-geo';
import * as d3 from 'd3';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';


@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [],
	providers: [ChartdataService],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
	statesFeatures: any[]=[];
  chart: any;
  public hoveredStateName: string = '';
  constructor(private data: ChartdataService) { }
    ngAfterViewInit() {
    this.data.getData().subscribe((us: any) => {
      console.log(us);
      const nation= feature(us, us.objects.nation) as ChartGeo.Feature;
      
      const states= feature(us, us.objects.states) as ChartGeo.Feature;
      const nationFeatures= nation.features[0];
  
    const stateNames: { [key: string]: string } = {
       'Alabama':'AL',
       'Alaska':'AK',
       'American Samoa':'AS',
      'Arizona': 'AZ',
       'Arkansas':'AR',
       'California':'CA',
      'Colorado': 'CO',
      'Commonwealth of the Northern Mariana Islands':'CNMI',
       'Connecticut':'CT',
      'Delaware':'DE',
      'District of Columbia':'DC',
      'Florida':'FL',
      'Georgia':'GA',
      'Guam':'GU',
      'Hawaii':'HI',
      'Idaho':'ID',
      'Illinois':'IL',
      'Indiana':'IN',
      'Iowa':'IA',
     'Kansas': 'KS',
      'Kentucky':'KY',
      'Louisiana':'LA', 
      'Maine':'ME',
     'Maryland': 'MD',
     'Massachusetts': 'MA',
      'Michigan':'MI',
      'Minnesota':'MN',
     'Mississippi': 'MS',
      'Missouri':'MO',
    'Montana':  'MT',
     'Nebraska': 'NE',
     'Nevada': 'NV',
      'New Hampshire':'NH',
      'New Jersey':'NJ',
     'New Mexico': 'NM',
     'New York': 'NY',
       'North Carolina':'NC',
      'North Dakota':'ND',
     'Ohio': 'OH',
     'Oklahoma': 'OK',
     'Oregon': 'OR',
     'Puerto Rico':'PR',
     'Pennsylvania': 'PA',
     'Rhode Island': 'RI',
     'South Carolina': 'SC',
      'South Dakota':'SD',
     'Tennessee':  'TN',
      'Texas':'TX',
      'United States Virgin Islands':'VI',
      'Utah': 'UT',
      'Vermont':'VT',
     'Virginia':'VA',
    'Washington':'WA',
     'West Virginia':'WV',
     'Wisconsin': 'WI',
     'Wyoming': 'WY'
    };
    const smallStates=['Vermont', 'New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'Delaware', 'Maryland', 'New Jersey', 'Hawaii', 'District of Columbia'];
    console.log(states.features[0]);
    
      states.features = states.features.map((f: {
        geometry: any;
        id:any;
         properties: {name: any;},
          type: any;
}) => {
        const abbreviation =stateNames[f.properties.name];
        return {
   
   
            geometry: f.geometry,
            type: f.type,
            tooltip:abbreviation,
            properties: {
              name: f.properties.name,
              tooltip: abbreviation,
            },
        };
      });

    
      console.log(nation);
      console.log(states);

     
      this.statesFeatures= states.features; 
      console.log(this.statesFeatures);

      this.statesFeatures.forEach((state: any) => {
        state.x = state.geometry.coordinates[0];
        state.y = state.geometry.coordinates[1];
        state.r = 10;
      });
  
      // Position labels for small states outside the states
      this.statesFeatures.forEach((state: any) => {
        if (smallStates.includes(state.properties.name)) {
          state.labelX = state.x + 20;  // Offset label position
          state.labelY = state.y - 20;
        } else {
          state.labelX = state.x;
          state.labelY = state.y;
        }
      });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

  

 
      
  if(ctx!==null){
    Chart.register(CategoryScale);
    Chart.register(ChartDataLabels);
    Chart.register(ChoroplethController, ProjectionScale, GeoFeature, ColorScale);

  const chart: Chart = new Chart(ctx, {
    type: 'choropleth',
    data: {
      labels: this.statesFeatures.map((d: any) => d.properties.name),
      datasets: [{
        label: 'States',
        outline: nationFeatures,
        data: this.statesFeatures.map((d: any) =>({feature: d as ChartGeo.Feature, value: Math.random()*10})),
      }]
    },
    options: {
      responsive: true,
      onHover: (event, chartElement) => {
        if (chartElement[0]) {
            const index = chartElement[0].index;
            const stateName = this.statesFeatures[index].properties.name;
            this.hoveredStateName = stateName;
        }
    },
      plugins: {
        legend: {
          display: false,
        },
        datalabels:{
          color: '#000',
          formatter: ( context: any) => {
            return context.feature.properties.tooltip;
          },
  },
  tooltip: {
    enabled: true,
    callbacks: {
      label: function(context: any) {
        return (context.raw as any).feature.properties.tooltip;
      }
    }
  },
},
  
  scales: {
    projection:{
      axis: 'x',
      projection: 'albersUsa',
    },
    color: {
      axis: 'x',
      quantize: 10,
      legend: {
        position: 'bottom-right',
        align: 'bottom',
    }
  }
}
    },
    
  }
  );
 
}


});
    }
  

}
