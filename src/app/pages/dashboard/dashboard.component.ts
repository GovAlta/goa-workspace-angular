import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
  OnInit,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewportService } from '../../services/viewport.service';
import {
  GoabGrid,
  GoabText,
  GoabxButton,
  GoabContainer,
} from '@abgov/angular-components';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { WorkQueueCardComponent } from './components/work-queue-card/work-queue-card.component';
import { ComingUpItemComponent } from './components/coming-up-item/coming-up-item.component';
import { ActivityItemComponent } from './components/activity-item/activity-item.component';
import { Case } from '../../types/case';
import { ActivityItem } from '../../types/activity';
import {
  parseDate,
  formatDate,
  formatShortDate,
  formatDueDate,
  getGreeting,
} from '../../utils/date-utils';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { curveNatural } from 'd3-shape';
import mockCases from '../../data/mockCases.json';
import mockActivity from '../../data/mockActivity.json';
import mockChartData from '../../data/mockChartData.json';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    GoabContainer,
    GoabGrid,
    GoabText,
    GoabxButton,
    NgxChartsModule,
    StatCardComponent,
    WorkQueueCardComponent,
    ComingUpItemComponent,
    ActivityItemComponent,
    PageHeaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  cases = mockCases as Case[];
  activity = mockActivity as ActivityItem[];
  greeting = getGreeting();
  todayFormatted = formatDate(new Date());
  shortDate = formatShortDate(new Date());
  stats = { myCases: 0, overdue: 0, dueSoon: 0, completed: 0 };
  workQueue: (Case & { isOverdue: boolean })[] = [];
  comingUp: (Case & { relativeDate: string })[] = [];

  // Chart config
  chartData = [
    {
      name: 'New',
      series: mockChartData.map((d) => ({ name: d.date, value: d.newCases })),
    },
    {
      name: 'Completed',
      series: mockChartData.map((d) => ({ name: d.date, value: d.completed })),
    },
    {
      name: 'Updated',
      series: mockChartData.map((d) => ({ name: d.date, value: d.updated })),
    },
  ];
  curveNatural = curveNatural;
  legendBelow = LegendPosition.Below;
  chartView: [number, number] = [Math.min(window.innerWidth - 64, 600), 200];
  private resizeObserver?: ResizeObserver;
  chartColors = [
    { name: 'New', value: '#be8cfb' },
    { name: 'Completed', value: '#8ac340' },
    { name: 'Updated', value: '#f0963e' },
  ];

  viewport = inject(ViewportService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.computeStats();
    this.computeWorkQueue();
    this.computeComingUp();
  }

  private computeStats() {
    const today = new Date();
    const myCases = this.cases.filter((c) => c.staff === 'Edna Mode');
    const overdue = myCases.filter((c) => {
      const dueDate = parseDate(c.dueDate);
      return dueDate && dueDate < today;
    });
    const dueSoon = myCases.filter((c) => {
      const dueDate = parseDate(c.dueDate);
      if (!dueDate) return false;
      const diffDays = Math.floor(
        (dueDate.getTime() - today.getTime()) / 86400000,
      );
      return diffDays >= 0 && diffDays <= 7;
    });
    const completed = myCases.filter((c) => c.category === 'complete');

    this.stats = {
      myCases: myCases.length,
      overdue: overdue.length,
      dueSoon: dueSoon.length,
      completed: completed.length,
    };
  }

  private computeWorkQueue() {
    const today = new Date();
    this.workQueue = this.cases
      .filter((c) => c.staff === 'Edna Mode' && c.category !== 'complete')
      .map((c) => ({
        ...c,
        isOverdue: (() => {
          const dueDate = parseDate(c.dueDate);
          return dueDate ? dueDate < today : false;
        })(),
      }))
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        const dateA = parseDate(a.dueDate);
        const dateB = parseDate(b.dueDate);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }

  private computeComingUp() {
    const today = new Date();
    this.comingUp = this.cases
      .filter((c) => {
        const dueDate = parseDate(c.dueDate);
        return dueDate && dueDate >= today && c.staff === 'Edna Mode';
      })
      .sort((a, b) => {
        const dateA = parseDate(a.dueDate)!;
        const dateB = parseDate(b.dueDate)!;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5)
      .map((c) => ({
        ...c,
        relativeDate: formatDueDate(c.dueDate),
      }));
  }

  private el = inject(ElementRef);

  ngAfterViewInit() {
    const chartWrapper = this.el.nativeElement.querySelector(
      '.dashboard-chart-wrapper',
    );
    if (chartWrapper) {
      this.resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        if (width > 0) {
          this.chartView = [width, 200];
        }
      });
      this.resizeObserver.observe(chartWrapper);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  navigateToCases(hash?: string) {
    this.router.navigate(['/cases'], { fragment: hash || '' });
  }
}
