import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner } from "@chakra-ui/react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const ResultsPage = () => {
  const [radarData, setRadarData] = useState(null);
  const [temperatureData, setTemperatureData] = useState(null);

  useEffect(() => {
    const storedRadarData = localStorage.getItem('radarData');
    const storedTemperatureData = localStorage.getItem('temperatureData');

    if (storedRadarData) setRadarData(JSON.parse(storedRadarData));
    if (storedTemperatureData) setTemperatureData(JSON.parse(storedTemperatureData));

    // Clear the data from localStorage after retrieving
    localStorage.removeItem('radarData');
    localStorage.removeItem('temperatureData');
  }, []);

  if (!radarData || !temperatureData) {
    return (
      <ChakraProvider>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box maxWidth="800px" margin="auto" padding={5}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            Analysis Results
          </Heading>

          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Performance Overview</Tab>
              <Tab>Temperature Properties</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <RadarChart width={600} height={400} outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" fontSize='18px' fontWeight='bold'/>
                    <PolarRadiusAxis />
                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <LineChart width={600} height={400} data={temperatureData[0]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number"
                      dataKey="temperature" 
                      domain={['dataMin', 'dataMax']}
                      label={{ value: 'Temperature (°C)', position: 'bottom' }} 
                    />
                    <YAxis 
                      label={{ value: 'tan δ', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    {temperatureData.slice(1).map((record, index) => (
                      <Line 
                        key={index + 1}
                        type="monotone" 
                        data={record}
                        dataKey="value"
                        stroke="#cccccc"
                        strokeWidth={1}
                        dot={false}
                      />
                    ))}
                    <Line 
                      key={0}
                      type="monotone" 
                      data={temperatureData[0]}
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default ResultsPage;