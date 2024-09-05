import { useState } from "react";
import { useRouter } from 'next/navigation';
import MarketContent from "./marketContent";
import { MainMarketProps, marketData } from "./mainMarket";
import { peerMarketData } from "./peerMarketData";
import DepositWithdraw from "./DepositWithdraw/DepositWithdraw";

const Market = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Main Market");
  const [Protocol, setProtocol] = useState<"Protocol" | "P2P">("Protocol");
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"Deposit" | "Borrow">("Deposit");
  const [selectedCoin, setSelectedCoin] = useState({
    asset: "",
    image: "",
    balance: 0,
  });

  const options = ["Main Market", "Meme Market"];

  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const openModal = (type: "Deposit" | "Borrow", data: Partial<MainMarketProps>) => {
    setModalType(type);
    setSelectedCoin({
      asset: data.asset || "",
      image: data.image || "",
      balance: data.balance || 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAction = (action: "Lend" | "Borrow", data: Partial<MainMarketProps>) => {
    if (Protocol === "P2P") {
      // Navigate to different pages based on action
      if (action === "Lend") {
        router.push(`peerprotocolapp/LendMarket`);
      } else if (action === "Borrow") {
        router.push(`peerprotocolapp/BorrowMarket`);
      }
    } else {
      // Handle other actions
      openModal(action as "Deposit" | "Borrow", data);
    }
  };
  

  return (
    <div className="p-8">
      <div className="relative text-left flex justify-between pt-20 pb-8">
        <p className="text-black text-3xl">Main Market</p>

        <div className="flex items-center gap-8">
          <div className="flex gap-3 bg-gray-200 rounded-xl">
            <div
              className={`rounded-xl text-black flex gap-3 py-2 px-4 border cursor-pointer ${Protocol === "Protocol" ? "text-white bg-black" : ""}`}
              onClick={() => setProtocol("Protocol")}
            >
              <p>Protocol</p>
            </div>
            <div
              className={`rounded-xl text-black flex gap-3 py-2 px-4 border cursor-pointer ${Protocol === "P2P" ? "text-white bg-black" : ""}`}
              onClick={() => setProtocol("P2P")}
            >
              <p>P2P</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-32 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectChange(option)}
                    className={`flex items-center w-full px-4 py-2 text-sm ${option === selectedOption ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto text-black border">
        <div className="grid grid-cols-5 pt-6 rounded-t-xl bg-smoke-white py-4">
          <div className="text-center font-semibold">Asset</div>
          <div className="text-center font-semibold">Supply</div>
          <div className="text-center font-semibold">Borrow</div>
          <div className="text-center font-semibold">Supply APY</div>
          <div className="text-center font-semibold">Borrow APY</div>
        </div>

        {/* Render MarketContent with action handler */}
        <MarketContent
          marketData={Protocol === "Protocol" ? marketData : peerMarketData}
          onAction={handleAction}
        />
      </div>

      {/* Modal for Protocol mode */}
      {isModalOpen && (
        <DepositWithdraw
          type={modalType}
          availableBalance={selectedCoin.balance}
          currencyIcon={selectedCoin.image}
          currencyName={selectedCoin.asset}
          onClose={closeModal}
          onSubmit={(amount) => {
            console.log(`${modalType} Amount:`, amount);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default Market;
