import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast();
  const { navigate } = useNavigation();
  const handleJoinPoll = async () => {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        return toast.show({
          title: "Please fill the code.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/polls/join", { code });

      toast.show({
        title: "Joined successfully to poll",
        placement: "top",
        bgColor: "green.500",
      });
      setIsLoading(false);
      navigate("polls");
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.show({
        title: error.response?.data?.message
          ? error.response.data.message
          : "Cannot find the poll",
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Find by code" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          marginBottom={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="Find bet"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  );
}
