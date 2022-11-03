import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-world-cup-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolsCount: number;
  betsCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert("New bet created");
      setPoolTitle("");
    } catch (error) {
      console.log(error);
      alert("Error creating new bet");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="NLW World Cup " />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.betsCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="world-cup" quality={100} />
    </div>
  );
}

//TODO: Change to getStaticProps
export const getServerSideProps = async () => {
  const [poolsCountResponse, betsCountReponse, usersCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("bets/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolsCount: poolsCountResponse.data.count,
      betsCount: betsCountReponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
