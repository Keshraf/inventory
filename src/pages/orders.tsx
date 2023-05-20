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
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {`Orders`}
            </h1>
          </div>
        </header>
        <OrdersHeader />
        <OrdersTable />
      </Layout>
    </>
  );
};

OrdersPage.private = true;

export default OrdersPage;
