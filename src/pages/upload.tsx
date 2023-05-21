import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
import { nanoid } from "nanoid";
import Head from "next/head";

const UploadPage = () => {
  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>

      <Layout>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {`Upload`}
            </h1>
          </div>
        </header>
        <Dropzone />
      </Layout>
    </>
  );
};

UploadPage.private = true;

export default UploadPage;
