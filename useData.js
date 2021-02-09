import React, { useState, useEffect } from 'react';
import { csv } from 'd3';
const csvUrl =
  'https://gist.githubusercontent.com/andre6639/595f94303ecb60bb21c9fa4c0ddeb7c7/raw/d7bf9554332e6d7207cda1d796f7b66f27bd9473/Bay_Area_NOAA_Summary_of_the_Month_Oceanside&SFO.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.DATE = new Date(d.DATE);
      d.NAME = d.NAME;
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};
