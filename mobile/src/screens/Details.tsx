import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionsSelected] = useState<"My Bets" | "Ranking">(
    "My Bets"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  const fetchPollDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.poll);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Cannot get details of poll.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeShare = async () => {
    await Share.share({
      message: pollDetails.code,
    });
  };

  useEffect(() => {
    fetchPollDetail();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        showShareButton
        showBackButton
        onShare={handleCodeShare}
      />
      {pollDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="My Bets"
              isSelected={optionSelected === "My Bets"}
              onPress={() => setOptionsSelected("My Bets")}
            />
            <Option
              title="Ranking"
              isSelected={optionSelected === "Ranking"}
              onPress={() => setOptionsSelected("Ranking")}
            />
          </HStack>
          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetails.code} />
      )}
    </VStack>
  );
}
