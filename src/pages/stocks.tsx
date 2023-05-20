import StocksHeader from "@/components/ActionHeader/StocksHeader";
import Layout from "@/components/Layout";
import StocksTable from "@/components/Tables/StocksTable";
import Head from "next/head";
import { useState } from "react";

const StocksPage = () => {
  return (
    <>
      <Head>
        <title>Stocks</title>
      </Head>

      <Layout>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {`Stocks`}
            </h1>
          </div>
        </header>
        <StocksHeader />
        <StocksTable />
      </Layout>
    </>
  );
};

StocksPage.private = true;

export default StocksPage;
