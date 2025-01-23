import React from 'react';
import { Box, Text, Button, VStack, Input } from '@chakra-ui/react';

const LuggagePickupPage: React.FC = () => {
  return (
    <Box maxW="md" mx="auto" mt={16}>
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>수령 서비스</Text>
        <Text color="gray.500">보관하신 짐을 찾아가세요</Text>
      </Box>

      <VStack spacing={6}>
        <Box w="100%">
          <Text mb={2}>예약 번호</Text>
          <Input placeholder="예약 번호를 입력해주세요" />
        </Box>

        <Box w="100%">
          <Text mb={2}>전화번호</Text>
          <Input placeholder="전화번호를 입력해주세요" />
        </Box>

        <Button colorScheme="blue" w="100%">
          찾아가기
        </Button>
      </VStack>
    </Box>
  );
};

export default LuggagePickupPage; 