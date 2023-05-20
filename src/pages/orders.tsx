import OrdersHeader from "@/components/ActionHeader/OrdersHeader";
import Layout from "@/components/Layout";
import OrdersTable from "@/components/Tables/OrdersTable";
import Head from "next/head";

const OrdersPage = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Layout>
        <OrdersHeader />
        <OrdersTable />
      </Layout>
    </>
  );
};

OrdersPage.private = true;

export default OrdersPage;
