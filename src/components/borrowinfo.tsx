import React, { useState, useEffect } from "react";
import Table from "./Table";
import { infoTableLabels } from "@/lib/data";
import { useUserState } from "./WalletConnectProvider";
import { toast } from "react-toastify";
// import { infoDataType } from "@/lib/types";

const InfoTable = ({ tableItems }: { tableItems: any[] }) => {
  const [selectedPubKey, setSelectPubKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pState = useUserState();

  const acceptLoanIdx = async (item: any) => {
    setSelectPubKey(item.publicKey.toString());
    await pState.acceptLoan(
      item.account.idx,
      item.publicKey.toString(),
      item.account.lender.toString(),
      (
        item.account.mintAddress ??
        "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
      ).toString()
    );
  };

  useEffect(() => {
    if (tableItems && tableItems.length > 0) {
      setIsLoading(false);
    }
  }, [tableItems]);
  return isLoading ? (
    <div className="flex justify-center">Loading, Please wait...</div>
  ) : (
    <Table tableLabels={infoTableLabels} extraColumms={1}>
      {tableItems.map((item, index) => (
        <tr className="[*&>td]:py-4" key={index}>
          <td>{pState.ellipsify(item.account.lender.toString(), 5)}</td>
          <td>{item.assets ?? "USDC"}</td>
          <td>{item.account.amount / 10 ** 6}</td>
          <td>{item.account.interestRate}</td>
          <td>{item.account.duration.toString()}</td>
          <td>
            <button
              className="border border-white rounded-full p-3 px-6"
              onClick={(e) => acceptLoanIdx(item)}
              // disabled={result <= 80}
            >
              {pState.Trxpend && selectedPubKey == item.publicKey.toString()
                ? "Pending"
                : "Borrow"}
            </button>
          </td>
        </tr>
      ))}
    </Table>
  );
};

export default InfoTable;
