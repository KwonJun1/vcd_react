import React from 'react';
import { Box, Text, keyframes } from '@chakra-ui/react';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FancyTitle = () => {
  return (
    <Box
      position="relative"
      textAlign="center"
      py={8}
      mb={8}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
        backgroundSize="200% 200%"
        animation={`${gradientAnimation} 5s ease infinite`}
        opacity={0.7}
        filter="blur(10px)"
        zIndex={-1}
      />
      <Text
        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
        fontWeight="bold"
        color="white"
        textShadow="2px 2px 4px rgba(0,0,0,0.4)"
      >
        Virtual Compound Design
      </Text>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        color="gray.100"
        mt={2}
      >
        Innovate • Analyze • Optimize
      </Text>
    </Box>
  );
};

export default FancyTitle;