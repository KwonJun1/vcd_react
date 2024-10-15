import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const FancyTitle = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('gray.400', 'gray.400');

  return (
    <Box
      bg={bgColor}
      py={12}
      px={4}
      textAlign="center"
      borderBottom="4px solid"
      borderColor={accentColor}
      mb={8}
    >
      <Heading
        as="h1"
        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
        fontWeight="bold"
        color={textColor}
        mb={2}
      >
        Virtual Compound Design
      </Heading>
      <Text
        fontSize={{ base: 'md', md: 'xl' }}
        color={useColorModeValue('gray.600', 'gray.300')}
      >
        AI for advanced prediction and optimization of tire compounds
      </Text>
    </Box>
  );
};

export default FancyTitle;