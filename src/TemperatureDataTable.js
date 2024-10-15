import React, { useMemo } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

const TemperatureDataTable = ({ selectedTemperatureData }) => {
  const processedData = useMemo(() => {
    // Extract unique temperatures and sort them
    const temperatures = [...new Set(selectedTemperatureData[0].map(point => point.temperature))]
      .sort((a, b) => a - b);
    
    // Create an object for each curve, with temperature values as properties
    return selectedTemperatureData.map((curve, index) => {
      const rowData = { id: index, isOptimum: index === 0 };
      curve.forEach((point) => {
        rowData[point.temperature] = point.value;
      });
      return rowData;
    });
  }, [selectedTemperatureData]);

  const sortedTemperatures = useMemo(() => {
    if (processedData.length === 0) return [];
    return Object.keys(processedData[0])
      .filter(key => key !== 'id' && key !== 'isOptimum')
      .map(Number)
      .sort((a, b) => a - b);
  }, [processedData]);

  return (
    <Box>
      {/* <Text fontWeight="bold" mb={2}>온도별 데이터 테이블</Text> */}
      <Box maxHeight="240px" overflowY="auto" overflowX="auto" borderWidth="1px" borderRadius="lg">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th>Curve</Th>
              {sortedTemperatures.map(temp => (
                <Th key={temp}>{temp.toFixed(2)}°C</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {processedData.map((row) => (
              <Tr key={row.id} bg={row.isOptimum ? "blue.100" : undefined}>
                <Td fontWeight={row.isOptimum ? "bold" : "normal"}>
                  {row.isOptimum ? "Optimum" : `${row.id}`}
                </Td>
                {sortedTemperatures.map(temp => (
                  <Td key={temp} fontWeight={row.isOptimum ? "bold" : "normal"}>
                    {row[temp] ? row[temp].toFixed(4) : '-'}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TemperatureDataTable;