import Layout from "@/components/Layout";
import OrdersTable from "@/components/Tables/OrdersTable";

const OrdersPage = () => {
  return (
    <>
      <Layout>
        <OrdersTable />
      </Layout>
    </>
  );
};

OrdersPage.private = true;

export default OrdersPage;
