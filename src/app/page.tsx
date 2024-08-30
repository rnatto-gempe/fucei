"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link"; // substitua useRouter por Link

export default function Home() {
  const [techs, setTechs] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");

  const addTech = () => {
    const trimmedTech = newTech.trim();
    if (trimmedTech === "") {
      alert("O campo não pode estar vazio!");
      return;
    }
    if (techs.includes(trimmedTech)) {
      alert("Esta tecnologia já foi adicionada!");
      return;
    }
    setTechs([...techs, trimmedTech]);
    setNewTech("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTech();
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechs(techs.filter((tech) => tech !== techToRemove));
  };

  return (
    <>
      <Head>
        <title>Fucei - Cadastro de Tecnologias</title>
        <meta
          name="description"
          content="Cadastre e explore novas tecnologias no Fucei."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-between min-h-screen bg-white text-black">
        <header className="w-full fixed top-0 bg-white p-4 shadow-md z-10">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold mb-4">Fucei</h1>
            <div className="flex max-w-full">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border border-gray-300 p-2 rounded-l text-black flex-grow max-w-full"
                placeholder="Adicionar nova tecnologia"
              />
              <button
                onClick={addTech}
                className="bg-gradient-to-r from-blue-400 to-purple-600 text-white p-2 rounded-r hover:from-blue-500 hover:to-purple-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </header>
        <div className="mt-32 w-full max-w-5xl p-4 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techs.map((tech, index) => (
              <Link key={index} href={`/details/${tech}`}>
                <div
                  className="technology-card border border-gray-300 p-4 rounded-lg text-center bg-gradient-to-r from-blue-400 to-purple-600 text-white relative cursor-pointer"
                >
                  {tech}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTech(tech);
                    }}
                    className="absolute top-2 right-2 text-white p-1 rounded-full hover:border-black hover:border-2 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .technology-card {
          animation: fadeIn 0.3s ease-in-out;
        }

        button:hover {
          background-color: transparent;
        }
      `}</style>
    </>
  );
}