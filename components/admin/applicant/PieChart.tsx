import { ArcElement, Chart as ChartJS, ChartOptions, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

export type PieChartData = {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
  }>;
};

interface PieChartProps {
  chartData: PieChartData;
}

const PieChart = ({ chartData }: PieChartProps) => {
  const [legendPosition, setLegendPosition] = useState<'right' | 'bottom'>(
    'right'
  );

  useEffect(() => {
    const handleResize = () => {
      setLegendPosition(window.innerWidth >= 834 ? 'right' : 'bottom');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        font: { size: 14 },
        formatter: (value, context) => {
          if (!value) return '';
          const dataset = context.dataset.data as number[];
          const total = dataset.reduce((sum, v) => sum + v, 0);
          return `${Math.floor((value / total) * 100)}%`;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { right: legendPosition === 'right' ? 24 : 0 },
    },
  };

  const customLegend = chartData.labels?.map((label, i) => (
    <div key={label} className="flex items-center mb-4 w-[167px]">
      <div
        className="mr-4"
        style={{
          width: 60,
          height: 24,
          backgroundColor: chartData.datasets[0].backgroundColor?.[i],
        }}
      />
      <span className="text-[16px]">{label}</span>
    </div>
  ));

  return (
    <div
      className={`w-full flex ${
        legendPosition === 'right' ? 'flex-row' : 'flex-col'
      } items-center justify-center`}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 280, height: 280, padding: '37.62px' }}
      >
        <Pie data={chartData} options={options} />
      </div>

      <div
        className={`${
          legendPosition === 'right' ? 'ml-6 mt-12' : 'mt-6'
        } flex flex-col`}
      >
        {customLegend}
      </div>
    </div>
  );
};

export default PieChart;
