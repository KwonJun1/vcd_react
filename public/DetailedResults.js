import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, Box, VStack, Heading, Image, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Fancy3DPlot from './Fancy3DPlot';
import TemperatureDataTable from './TemperatureDataTable';

function DetailedResults() {
  const data = window.detailedResultsData;

  return (
    <ChakraProvider>
      <VStack spacing={12} align="stretch" p={5}>
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            예측 결과 상세 — 점탄성
          </Heading>
          <Tabs defaultIndex={0}>
            <TabList>
              <Tab>3D Plot</Tab>
              <Tab>2D Plot</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box height="520px">
                  <Fancy3DPlot selectedTemperatureData={data.selectedTemperatureData} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box height="520px">
                  {/* Your 2D plot implementation */}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        
        <Box>
          <TemperatureDataTable selectedTemperatureData={data.selectedTemperatureData} />
        </Box>
        
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            분자 구조 예측 결과
          </Heading>
          {data.selectedImage && (
            <Box height="400px">
              <Image 
                src={`/images/${data.selectedImage}`} 
                alt="Compound visualization"
                objectFit="contain"
                width="100%"
                height="100%"
                fallback={<Text>Image loading failed</Text>}
              />
            </Box>
          )}
        </Box>
      </VStack>
    </ChakraProvider>
  );
}

ReactDOM.render(<DetailedResults />, document.getElementById('root'));