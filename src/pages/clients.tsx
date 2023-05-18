import Layout from "@/components/Layout";
import ClientsTable from "@/components/Tables/ClientsTable";

const ClientsPage = () => {
  return (
    <>
      <Layout>
        <ClientsTable />
      </Layout>
    </>
  );
};

ClientsPage.private = true;

export default ClientsPage;
