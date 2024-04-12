import React from "react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// const input = {
//   _tokens: [
//     {
//       _address: "0xEb51553D10B3177F4FEefcB0A85D0C1F5cBb81ae",
//       _quantity: "100000000000000000000",
//       _chainId: 128123,
//       _contributor: "0x0000000000000000000000000000000000000000",
//       _aggregator: "0x76281BCDEFadD3dA0b57Ff8dCd188922Eaf49240",
//     },
//     {
//       _address: "0xEf4E389997548234E138C88567925B1B20746EdC",
//       _quantity: "200000000000000000000",
//       _chainId: 128123,
//       _contributor: "0x0000000000000000000000000000000000000000",
//       _aggregator: "0x11FC4928bf7CA4C3f465c36c72364D3c35f7917c",
//     },
//   ],
//   state: 2,
// };

const getRandomColorFromAddress = (address: string) => {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

interface PieTokenProps {
  input: {
    _tokens: {
      _address: string;
      _quantity: string;
      _chainId: number;
      _contributor: string;
      _aggregator: string;
    }[];
    state: number;
  };
}
interface CustomChartDataset extends ChartDataset<"pie", number[]> {
  customLabels?: string[];
}

const PieToken: React.FC<PieTokenProps> = props => {
  // use your props here
  const { input } = props;
  const data = {
    datasets: [
      {
        data:  input._tokens.map(token => token._quantity.toString()),
        backgroundColor: input._tokens.map(token => getRandomColorFromAddress(token._address)),
        customLabels: input._tokens.map(token => token._address),
      },
    ],
    labels: input._tokens.map(token => token._address),
  };

  const emptyData = {
    datasets: [
      {
        data: [100],
        backgroundColor: [
            "rgba(211,211,211,1)",
        ],
        customLabels: ["No Token deposited"],
      },
    ],
    labels: ["No Data"],
  };

  return (
    <div style={{ width: "400px", height: "300px", marginBottom: "20px" }}>
      <Pie data={
        input._tokens.length > 0 ? data : emptyData
      }></Pie>
    </div>
  );
};

export default PieToken;
