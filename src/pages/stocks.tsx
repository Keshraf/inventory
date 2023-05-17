import StocksHeader from "@/components/ActionHeader/StocksHeader";
import Layout from "@/components/Layout";
import StocksTable from "@/components/Tables/StocksTable";

const StocksPage = () => {
  return (
    <>
      <Layout>
        <StocksHeader />
        <StocksTable />
      </Layout>
    </>
  );
};

export default StocksPage;
