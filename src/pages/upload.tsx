import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";

const UploadPage = () => {
  return (
    <>
      <Layout>
        <Dropzone />
      </Layout>
    </>
  );
};

UploadPage.private = true;

export default UploadPage;
