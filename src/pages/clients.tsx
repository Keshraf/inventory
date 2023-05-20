import ClientsHeader from "@/components/ActionHeader/ClientsHeader";
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
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {`Clients`}
            </h1>
          </div>
        </header>
        <ClientsHeader />
        <ClientsTable />
      </Layout>
    </>
  );
};

ClientsPage.private = true;

export default ClientsPage;
