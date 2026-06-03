import { useApp } from "@/contexts/AppContext";
import colors from "@/Themes/theme";
import { keyToTitle } from "@/utils/stringHelper";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import { PieChart, pieClasses } from '@mui/x-charts/PieChart';
import { useQuery } from "@tanstack/react-query";
import { Card, Empty } from "antd";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";
import InlinePopover from "../InlinePopover";

function OwnershipWidget() {

  const { darkMode } = useApp();

  const { data, isLoading } = useQuery({
    queryKey: ['ownership'],
    queryFn: () => axios.get(route('dashboard-data.ownership')).then(res => res.data),
    staleTime: Infinity
  });

  const chartData = data ? Object.entries(data).map(([key, value], index) => ({
    label: keyToTitle(key),
    value: value as number,
    color: colors[['purple', 'orange'][index % 2]][darkMode ? 700 : 400],
  })) : [];

  const sizing = {
    margin: { right: 5 },
    width: 260,
    height: 130,
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
            startAngle:-90,
            endAngle: 90,
            cx: '50%',
            cy: '100%',
            innerRadius: 50,
            outerRadius: 120,
            data: chartData,
            arcLabel: getArcLabel,
            paddingAngle: 2,
            arcLabelMinAngle: 5,
            highlightScope: { fade: 'global', highlight: 'none' },
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
      title='Ownership Split'
      loading={isLoading}
      className='min-h-[265px]'
    >
      {
        totalArtworks == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No artworks found" rootClassName="m-1" />
      }

      { totalArtworks > 0 && (
        <div>
          <div className="text-muted flex items-center gap-1 mb-2">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} />
            <div>
              Ownership split of
              <InlinePopover content='All artworks that are not sold yet.'>
                active
              </InlinePopover>
              artworks.
            </div>
          </div>
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
        </div>
      )}
    </Card>
  );
}

export default OwnershipWidget;
