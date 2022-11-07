import { FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [homeTeamPoints, setHomeTeamPoints] = useState("");
  const [awayTeamPoints, setAwayTeamPoints] = useState("");

  const toast = useToast();

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/polls/${poolId}/games`);
      setGames(response.data.games);
      console.log(response.data);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Cannot load the games",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBetConfirm = async (gameId: string) => {
    try {
      if (!homeTeamPoints.trim() || !awayTeamPoints.trim()) {
        return toast.show({
          title: "Please select the bet.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${poolId}/games/${gameId}/bets`, {
        homeTeamPoints: Number(homeTeamPoints),
        awayTeamPoints: Number(awayTeamPoints),
      });

      toast.show({
        title: "Bet confirmed.",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Cannot confirm the bet to this game.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setHomeTeamPoints={setHomeTeamPoints}
          setSecondTeamPoints={setAwayTeamPoints}
          onGuessConfirm={() => handleBetConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
