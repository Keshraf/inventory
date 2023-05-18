import StocksHeader from "@/components/ActionHeader/StocksHeader";
import Layout from "@/components/Layout";
import StocksTable from "@/components/Tables/StocksTable";
import Head from "next/head";

const StocksPage = () => {
  return (
    <>
      <Head>
        <title>Stocks</title>
      </Head>
      <Layout>
        <StocksHeader />
        <StocksTable />
      </Layout>
    </>
  );
};

StocksPage.private = true;

export default StocksPage;
