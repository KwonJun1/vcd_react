import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button,
  HStack,
  Select,
  Divider,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs, TabList, TabPanels, Tab, TabPanel, Flex
} from "@chakra-ui/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label
} from "recharts";
import temperatureData from './tand.json';
import TemperatureDataTable from './TemperatureDataTable';
import Fancy3DPlot from './Fancy3DPlot';
import FancyTitle from './FancyTitle';  // Make sure to create this file

const imageFiles = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png',
  'image6.png', 'image7.png', 'image8.png', 'image9.png', 'image10.png'
];



function App() {
  const [polymer, setPolymer] = useState({ NR: 0, BR: 0, SBR: 0 });
  const [selectedTemperatureData, setSelectedTemperatureData] = useState(null);
  const [currentPolymerStep, setCurrentPolymerStep] = useState("NR");
  const [isRubberSettingComplete, setIsRubberSettingComplete] = useState(false);
  const [animatedResult, setAnimatedResult] = useState(null);
  const [showTemperatureChart, setShowTemperatureChart] = useState(false);
  const [isRadarAnimationComplete, setIsRadarAnimationComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose: disclosureOnClose } = useDisclosure();
  const [showOpenResultsButton, setShowOpenResultsButton] = useState(false);
  const [hasModalBeenOpened, setHasModalBeenOpened] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);

  const onClose = () => {
    disclosureOnClose();
    if (hasModalBeenOpened) {
      setShowOpenResultsButton(true);
    }
  };
  
  const reopenModal = () => {
    onOpen();
    setShowOpenResultsButton(false);
  };
  const [otherIngredients, setOtherIngredients] = useState([
    {
      name: "필러",
      materials: ["필러 조합 1", "필러 조합 2", "필러 조합 3", "필러 조합 4", "필러 조합 5", "필러 조합 6"],
      selected: "",
      values: {},
    },
    {
      name: "오일",
      materials: ["오일 1", "오일 2", "오일 3", "오일 4"],
      selected: "",
      values: {},
    },
    {
      name: "고기능성 폴리머 (신물질)",
      materials: ["물질 1", "물질 2", "물질 3"],
      selected: "",
      values: {},
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    return imageFiles[randomIndex];
  };

  const handlePolymerChange = (type, value) => {
    if (type === "NR" && currentPolymerStep === "NR") {
      setPolymer((prev) => ({ ...prev, NR: value }));
    } else if (type === "BR" && currentPolymerStep === "BR") {
      setPolymer((prev) => ({
        ...prev,
        BR: value,
        SBR: 100 - prev.NR - value,
      }));
    }
  };

  const selectRandomDataset = () => {
    const inputString = JSON.stringify({polymer, otherIngredients});
    const hash = inputString.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % temperatureData.length;
    return JSON.parse(temperatureData[index]);
  };

  const confirmPolymer = () => {
    if (currentPolymerStep === "NR") {
      if (polymer.NR === 100) {
        setPolymer((prev) => ({ ...prev, BR: 0, SBR: 0 }));
        setCurrentPolymerStep("finished");
        setIsRubberSettingComplete(true);
      } else {
        setPolymer((prev) => ({
          ...prev,
          BR: 0,
          SBR: 100 - prev.NR
        }));
        setCurrentPolymerStep("BR");
      }
    } else if (currentPolymerStep === "BR") {
      setCurrentPolymerStep("finished");
      setIsRubberSettingComplete(true);
    }
  };

  const resetPolymer = () => {
    setPolymer({ NR: 0, BR: 0, SBR: 0 });
    setCurrentPolymerStep("NR");
    setIsRubberSettingComplete(false);
  };

  const getMaxPolymerValue = (type) => {
    if (type === "NR") return 100;
    if (type === "BR") return 100 - polymer.NR;
    return 100;
  };

  const handleIngredientSelect = (index, value) => {
    setOtherIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients[index].selected = value;
      return newIngredients;
    });
  };

  const addMaterial = (index) => {
    setOtherIngredients((prev) => {
      const newIngredients = [...prev];
      if (
        newIngredients[index].selected &&
        !(newIngredients[index].selected in newIngredients[index].values)
      ) {
        newIngredients[index].values[newIngredients[index].selected] = 0;
      }
      newIngredients[index].selected = "";
      return newIngredients;
    });
  };

  const handleMaterialValueChange = (ingredientIndex, material, value) => {
    setOtherIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients[ingredientIndex].values[material] = value;
      return newIngredients;
    });
  };

  const removeMaterial = (ingredientIndex, material) => {
    setOtherIngredients((prev) => {
      const newIngredients = [...prev];
      delete newIngredients[ingredientIndex].values[material];
      return newIngredients;
    });
  };

  const processTemperatureData = (data) => {
    return data.map(record => {
      const sortedEntries = Object.entries(record)
        .map(([temp, value]) => ({ temperature: parseFloat(temp), value }))
        .sort((a, b) => a.temperature - b.temperature);
      return sortedEntries;
    });
  };


  const analyzeCompound = () => {
    if (!isRubberSettingComplete) {
      alert("고무 함량 설정을 먼저 완료해주세요.");
      return;
    }
    setIsAnalyzing(true);
    setShowTemperatureChart(false);
    setIsRadarAnimationComplete(false);
    setAnimatedResult(null);
    setSelectedTemperatureData(null);
    setSelectedImage(null);
    setHasModalBeenOpened(false);
    setIsResultReady(false);
    setTimeout(() => {
      console.log("Timeout callback started");
      const { NR, BR, SBR } = polymer;
      const filler = otherIngredients[0].values;
      const oil = otherIngredients[1].values;
      const newMaterial = otherIngredients[2].values;
  
      // Helper function to calculate the sum of values in an object
      const sum = obj => Object.values(obj).reduce((a, b) => a + b, 0);
  
      // Normalize polymer percentages
      const totalPolymer = NR + BR + SBR;
      const nrRatio = NR / totalPolymer;
      const brRatio = BR / totalPolymer;
      const sbrRatio = SBR / totalPolymer;
  
      // Calculate scores (ensure they're between 0 and 100)
      const lrr = Math.min(Math.max(
        40 + (nrRatio * 10) - (brRatio * 8) - (sbrRatio * 8) + 
        (sum(filler) * 0.2) + (sum(oil) * 0.3) + (sum(newMaterial) * 0.1)
      , 0), 100);
  
      const wear = Math.min(Math.max(
        40 - (nrRatio * 5) + (brRatio * 10) + (sbrRatio * 5) + 
        (sum(filler) * 0.3) - (sum(oil) * 0.2) + (sum(newMaterial) * 0.1)
      , 0), 100);
  
      const wet = Math.min(Math.max(
        40 - (nrRatio * 5) + (brRatio * 5) + (sbrRatio * 10) + 
        (sum(filler) * 0.25) + (sum(oil) * 0.1) + (sum(newMaterial) * 0.1)
      , 0), 100);
  
      const snow = Math.min(Math.max(
        40 + (nrRatio * 5) - (brRatio * 5) + (sbrRatio * 10) + 
        (sum(filler) * 0.25) + (sum(oil) * 0.1) + (sum(newMaterial) * 0.3)
      , 0), 100);
  
      const price = Math.min(Math.max(
        100 - (40 + (nrRatio * 5) + (brRatio * 10) + (sbrRatio * 15) + 
        (sum(filler) * 0.1) + (sum(oil) * 0.1) + (sum(newMaterial) * 0.4) ) * 0.75
      , 0), 100);
  
      const finalResult = {
        data: [
          { subject: "연비", A: Math.round(lrr), fullMark: 100},
          { subject: "내구성", A: Math.round(wear), fullMark: 100 },
          { subject: "제동력", A: Math.round(wet), fullMark: 100 },
          { subject: "눈길 제동력", A: Math.round(snow), fullMark: 100 },
          { subject: "가격", A: Math.round(price), fullMark: 100 },
        ],
      };

      const selectedData = selectRandomDataset();
      const processedData = processTemperatureData(selectedData);
      setSelectedTemperatureData(processedData);

      const randomImage = selectRandomImage();
      setSelectedImage(randomImage);

      setAnalysisResult(finalResult);
      console.log("About to start chart animation");
      animateChart(finalResult);

    }, 100);
  };

  const animateChart = (finalResult) => {
    console.log("Chart animation started");
    const totalFrames = 60;
    const animationDuration = 200;
    let frame = 0;

    const animate = () => {
      if (frame <= totalFrames) {
        const progress = frame / totalFrames;
        const easedProgress = easeInOutCubic(progress);

        const animatedData = finalResult.data.map(item => {
          const maxDeviation = item.A * 0.15;
          const randomDeviation = (Math.random() * 2 - 1) * maxDeviation * (1 - easedProgress);
          const animatedValue = Math.min(item.A, item.A - randomDeviation);
          return {
            ...item,
            A: Math.round(Math.max(0, animatedValue))
          };
        });

        setAnimatedResult({ data: animatedData });
        frame++;
        requestAnimationFrame(animate);
      } else {
        console.log("Chart animation completed");
        setAnimatedResult(finalResult);
        setIsAnalyzing(false);
        setIsResultReady(true);  // Set this to true only after animation is complete
      }
    };

    requestAnimationFrame(animate);
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };



  useEffect(() => {
    if (isRadarAnimationComplete) {
      // Delay showing the temperature chart
      const timer = setTimeout(() => {
        setShowTemperatureChart(true);
      }, 500); // 500ms delay after radar animation completes
      return () => clearTimeout(timer);
    }
  }, [isRadarAnimationComplete]);

  return (
    <ChakraProvider>
      <Box maxWidth="800px" margin="auto" padding={5}>
        <VStack spacing={8} align="stretch">
          <FancyTitle />
  
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              고무 함량 설정
            </Heading>
            <Box mb={4}>
              <HStack spacing={4} alignItems="flex-end">
                <Box flex="1">
                  <Text mb={2} fontSize='18px'>천연 고무: {polymer.NR}%</Text>
                  <Slider
                    value={polymer.NR}
                    min={0}
                    max={getMaxPolymerValue("NR")}
                    onChange={(v) => handlePolymerChange("NR", v)}
                    isDisabled={currentPolymerStep !== "NR"}
                  >
                    <SliderTrack
                      bg={currentPolymerStep === "NR" ? "blue.100" : "gray.100"}
                    >
                      <SliderFilledTrack
                        bg={currentPolymerStep === "NR" ? "blue.500" : "gray.400"}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
                {currentPolymerStep === "NR" && (
                  <Button onClick={confirmPolymer} mt={4}>
                    확인
                  </Button>
                )}
              </HStack>
            </Box>
  
            <HStack spacing={4} alignItems="flex-end">
              <Box flex="1">
                <Text mb={2} fontSize='18px'>폴리 부타디엔 고무: {polymer.BR}%</Text>
                <Slider
                  value={polymer.BR}
                  min={0}
                  max={getMaxPolymerValue("BR")}
                  onChange={(v) => handlePolymerChange("BR", v)}
                  isDisabled={currentPolymerStep !== "BR"}
                >
                  <SliderTrack
                    bg={currentPolymerStep === "BR" ? "blue.100" : "gray.100"}
                  >
                    <SliderFilledTrack
                      bg={currentPolymerStep === "BR" ? "blue.500" : "gray.400"}
                    />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
              {currentPolymerStep === "BR" && (
                <Button onClick={confirmPolymer} mt={4}>
                  확인
                </Button>
              )}
            </HStack>
  
            <Box mt={4}>
              <Text mb={2} fontSize='18px'>스티렌 부타디엔 고무: {polymer.SBR}%</Text>
              <Slider
                value={polymer.SBR}
                min={0}
                max={100}
                isDisabled
              >
                <SliderTrack bg="gray.100">
                  <SliderFilledTrack bg="gray.400" />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
  
            <Button onClick={resetPolymer} mt={4} colorScheme="red">
              고무 함량 설정 초기화
            </Button>
          </Box>
  
          <Divider borderColor="gray.300" />
  
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              기타 원료 함량 설정
            </Heading>
            {otherIngredients.map((ingredient, index) => (
              <Box key={ingredient.name} mb={4}>
                <HStack spacing={2}>
                  <Select
                    placeholder={`${ingredient.name} 선택`}
                    value={ingredient.selected}
                    onChange={(e) =>
                      handleIngredientSelect(index, e.target.value)
                    }
                  >
                    {ingredient.materials.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </Select>
                  <Button
                    onClick={() => addMaterial(index)}
                    isDisabled={!ingredient.selected}
                  >
                    추가
                  </Button>
                </HStack>
              </Box>
            ))}
          </Box>
  
          <Divider borderColor="gray.300" />
  
          <Box>
            {otherIngredients.map((ingredient, index) => {
              const materials = Object.keys(ingredient.values);
              if (materials.length > 0) {
                return (
                  <Box key={ingredient.name} mb={4}>
                    <Heading as="h3" size="md" mb={2}>
                      {ingredient.name}
                    </Heading>
                    {materials.map((material) => (
                      <Box key={material} mb={4}>
                        <Text mb={2}>
                          {material}: {ingredient.values[material]}%
                        </Text>
                        <Slider
                          value={ingredient.values[material]}
                          min={0}
                          max={100}
                          onChange={(v) =>
                            handleMaterialValueChange(index, material, v)
                          }
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                        <Button
                          mt={2}
                          colorScheme="red"
                          onClick={() => removeMaterial(index, material)}
                        >
                          삭제
                        </Button>
                      </Box>
                    ))}
                  </Box>
                );
              }
              return null;
            })}
          </Box>
  
          <Box>
            <Button 
              onClick={analyzeCompound} 
              colorScheme="blue" 
              mb={4}
              isDisabled={!isRubberSettingComplete || isAnalyzing}
            >
              분석 시작
            </Button>
            {isAnalyzing && <Text>분석 중...</Text>}
            {animatedResult && (
              <Box>
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                  성능 예측 결과 요약
                </Heading>
                <Box height="450px" mb={6}>
                  <ResponsiveContainer>
                    <RadarChart outerRadius="70%" data={animatedResult.data}>
                      <PolarGrid />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        fontSize='16px' 
                        fontWeight='bold'
                        tick={(props) => {
                          const { payload, x, y, textAnchor, stroke, radius } = props;
                          const value = animatedResult.data.find(d => d.subject === payload.value).A;
                          return (
                            <g>
                              <text
                                x={x}
                                y={y}
                                textAnchor={textAnchor}
                                fill="#333"
                                fontSize="24px"
                                fontWeight="bold"
                              >
                                {payload.value}
                              </text>
                              <text
                                x={x}
                                y={y}
                                dy={20}
                                textAnchor={textAnchor}
                                fill="#666"
                                fontSize="20px"
                                fontWeight="bold"
                              >
                                {value}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
                {isResultReady && (
                  <Flex justifyContent="center">
                    <Button onClick={onOpen} colorScheme="green" size="lg">
                      자세히 보기
                    </Button>
                  </Flex>
                )}
              </Box>
            )}
          </Box>
  
          {showOpenResultsButton && (
            <Button onClick={reopenModal} colorScheme="green" mt={4}>
              결과 다시 보기
            </Button>
          )}
        </VStack>
      </Box>
  
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>예측 결과 상세 — 점탄성</Tab>
                <Tab>분자 구조 예측 결과</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={12} align="stretch">
                    {selectedTemperatureData && (
                      <Box>
                        <Tabs defaultIndex={0}>
                          <TabList>
                            <Tab>3D Plot</Tab>
                            <Tab>2D Plot</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <Box height="480px">
                                <Fancy3DPlot selectedTemperatureData={selectedTemperatureData} />
                              </Box>
                            </TabPanel>
                            <TabPanel>
                              <Box height="480px">
                                <ResponsiveContainer>
                                  <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      type="number"
                                      dataKey="temperature" 
                                      domain={['dataMin', 'dataMax']}
                                      label={{ value: 'Temperature (°C)', position: 'bottom', offset: -9.5}} 
                                    />
                                    <YAxis 
                                      label={{ value: 'tan δ', angle: -90, position: 'insideLeft' }} 
                                    />
                                    <Tooltip />
                                    {selectedTemperatureData.slice(1).map((record, index) => (
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
                                    {selectedTemperatureData.length > 0 && (
                                      <Line 
                                        key={0}
                                        type="monotone" 
                                        data={selectedTemperatureData[0]}
                                        dataKey="value"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={false}
                                      />
                                    )}
                                  </LineChart>
                                </ResponsiveContainer>
                              </Box>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </Box>
                    )}
                    
                    {selectedTemperatureData && (
                      <Box>
                        <TemperatureDataTable selectedTemperatureData={selectedTemperatureData} />
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Box>
                    {selectedImage && (
                      <Box 
                        width="100%" 
                        height="700px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Image 
                          src={`/images/${selectedImage}`} 
                          alt="Compound visualization"
                          objectFit="contain"
                          maxWidth="100%"
                          maxHeight="100%"
                          fallback={<Text>Image loading failed</Text>}
                        />
                      </Box>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default App;
