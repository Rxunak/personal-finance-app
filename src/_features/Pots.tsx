"use client";

import { useFinanceData, type Pot } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";

const Pots = () => {
  const { isPending, error, data } = useFinanceData();

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;

  return (
    <div className="bg-beige-100 pl-8 pr-8 pb-8 h-lvh overflow-scroll">
      <div className="mb-8 flex flex-row justify-between pt-6">
        <header className="flex items-center text-3xl font-semibold">
          Pots
        </header>
        <button className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-md bg-black text-sm text-white">
          + Add New Pot
        </button>
      </div>

      <main className="grid grid-cols-2 gap-5">
        {data.pots.map((pot: Pot, index: number) => {
          const percentageSaved = Math.min((pot.total / pot.target) * 100, 100);

          return (
            <section
              key={`${pot.name}-${index}`}
              className="rounded-2xl bg-white p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-2xl border"
                  style={{ background: pot.theme }}
                />
                <h2 className="text-xl font-bold">{pot.name}</h2>
              </div>

              <div className="mb-4 flex items-end justify-between">
                <p className="text-grey-500">Total Saved</p>
                <p className="text-3xl font-bold">
                  {pot.total.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </p>
              </div>

              <div className="mb-3 h-2 overflow-hidden rounded-full bg-beige-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentageSaved}%`,
                    backgroundColor: pot.theme,
                  }}
                />
              </div>

              <div className="flex justify-between text-sm text-grey-500">
                <span>{percentageSaved.toFixed(0)}%</span>
                <span>
                  Target of{" "}
                  {pot.target.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </span>
              </div>

              <div className="flex justify-around mt-4 gap-5 h-12">
                <div className="bg-beige-100 w-1/2 h-full flex items-center justify-center cursor-pointer rounded-md font-bold">
                  + Add Money
                </div>
                <div className="bg-beige-100 w-1/2 h-full cursor-pointer flex items-center justify-center rounded-md font-bold">
                  Withdraw
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Pots;
