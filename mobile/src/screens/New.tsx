import { Heading, VStack, Text } from "native-base";
import { Header } from "../components/Header";

import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New() {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Create new bet" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa e {"\n"}compartilhe entre amigos!
        </Heading>

        <Input marginBottom={2} placeholder="Qual nome do seu bolão?" />

        <Button title="Criar meu bolão" />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um {"\n"} código único que poderá
          usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
