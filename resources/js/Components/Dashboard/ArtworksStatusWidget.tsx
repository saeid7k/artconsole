import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { router } from "@inertiajs/react";
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import { PieChart, pieClasses } from '@mui/x-charts/PieChart';
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty } from "antd";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";

function ArtworksStatusWidget() {

  const { darkMode } = useApp();

  const { data, isLoading } = useQuery({
    queryKey: ['artworks-status'],
    queryFn: () => axios.get(route('dashboard-data.artworks-status')).then(res => res.data),
    staleTime: Infinity
  });

  const chartData = data ? Object.entries(data).map(([key, value]) => ({
    label: ARTWORK_STATUSES.find(status => status.value === key)?.label || key,
    value: value as number,
    color: colors[ARTWORK_STATUSES.find(status => status.value === key)?.color || 'default'][darkMode ? 700 : 400],
  })) : [];

  const sizing = {
    margin: { right: 5 },
    width: 160,
    height: 160,
    hideLegend: true,
    gapangle: 1,
  };

  const TOTAL = chartData.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  function Chart() {
    return (
      <PieChart
        series={[
          {
            innerRadius: 30,
            outerRadius: 80,
            data: chartData,
            arcLabel: getArcLabel,
            paddingAngle: 2,
            arcLabelMinAngle: 20,
            highlightScope: { fade: 'global', highlight: 'none' },
            valueFormatter: (value) => `${value.value} (${(value.value / TOTAL * 100).toFixed(0)}%)`,
          },
        ]}
        sx={{
          [`& .${pieClasses.arcLabel}`]: {
            fill: 'white',
            fontSize: 14,
          },
        }}
        {...sizing}
      />
    );
  }

  const totalArtworks = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      title='Artworks Status'
      loading={isLoading}
      className='min-h-[265px]'
    >
      {
        totalArtworks == 0 && (
          <FlexBox direction="col" >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} rootClassName="m-1" />
            <Button
              onClick={() => {router.visit(route('artworks.index'), {
                data: {
                  action: 'create',
                }
              })}}
            >
              Add your first Artwork
            </Button>
          </FlexBox>
        )
      }

      { totalArtworks > 0 && (
        <div className="flex items-end flex-wrap gap-4">
          <Chart />
          <div>
            {chartData.map((item) => (
              <FlexBox key={item.label} justifyContent="between" gap={3}>
                <FlexBox>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.color,
                      borderRadius: '50%',
                    }}
                  />
                  <div>{item.label}</div>
                </FlexBox>
                <div>{item.value}</div>
              </FlexBox>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default ArtworksStatusWidget;
