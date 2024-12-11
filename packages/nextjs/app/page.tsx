"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { 
  BookOpenIcon, 
  FaceSmileIcon, 
  PlusCircleIcon, 
  ShoppingBagIcon, 
  WrenchIcon 
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col items-center flex-grow pt-10">
        {/* Header Section */}
        <header className="px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the NFT Collection Creator
          </h1>
          <p className="text-lg text-gray-600">
            The one-stop solution to create, showcase, and trade your NFTs with ease.
          </p>
          <div className="mt-4 flex justify-center items-center space-x-2">
            <p className="font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-16 px-8 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4">Empowering Your Creativity</h2>
            <p className="text-lg">
              Mint NFTs seamlessly, explore active auctions, and showcase your collections. 
              The future of digital ownership starts here.
            </p>
            <div className="mt-6">
              <Link href="/mintCollection" passHref>
                <button className="btn btn-primary px-6 py-3 rounded-lg text-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-base-300 w-full py-12 px-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Explore Our Features
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <FeatureCard 
              icon={<PlusCircleIcon className="h-10 w-10 text-secondary" />} 
              title="Create Collections"
              description="Design your unique NFT collections effortlessly."
              link="/mintCollection"
            />
            <FeatureCard 
              icon={<BookOpenIcon className="h-10 w-10 text-secondary" />} 
              title="View Collections"
              description="Browse and showcase your created NFT collections."
              link="/displaycollection"
            />
            <FeatureCard 
              icon={<WrenchIcon className="h-10 w-10 text-secondary" />} 
              title="View Auctions"
              description="Participate in active NFT auctions and bid on your favorites."
              link="/viewauction"
            />
            <FeatureCard 
              icon={<ShoppingBagIcon className="h-10 w-10 text-secondary" />} 
              title="Purchased NFTs"
              description="Keep track of the NFTs you’ve acquired."
              link="/ownednfts"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-base-100 w-full py-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 NFT Marketplace. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="flex flex-col bg-white shadow-lg px-6 py-8 text-center items-center max-w-sm rounded-3xl">
      <div className="mb-4">{icon}</div>
      <h4 className="font-bold text-lg mb-2 dark:text-black">{title}</h4>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="text-primary hover:underline">
        Learn More
      </Link>
    </div>
  );
};

export default Home;
