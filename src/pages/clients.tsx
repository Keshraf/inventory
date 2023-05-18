import Layout from "@/components/Layout";
import ClientsTable from "@/components/Tables/ClientsTable";
import Head from "next/head";

const ClientsPage = () => {
  return (
    <>
      <Head>
        <title>Clients</title>
      </Head>
      <Layout>
        <ClientsTable />
      </Layout>
    </>
  );
};

ClientsPage.private = true;

export default ClientsPage;
