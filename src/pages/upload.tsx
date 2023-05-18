import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
import Head from "next/head";

const UploadPage = () => {
  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>
      <Layout>
        <Dropzone />
      </Layout>
    </>
  );
};

UploadPage.private = true;

export default UploadPage;
