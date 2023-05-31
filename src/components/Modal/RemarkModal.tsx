import { cn } from "@/utils/cn";
import { useLocalStorage } from "@mantine/hooks";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
};

const RemarkModal = ({ open, setOpen, id }: Props) => {
  const [remark, setRemark] = useLocalStorage<string>({
    key: id,
    defaultValue: "",
  });

  return (
    <>
      {open && (
        <section
          className={cn(
            "z-10 fixed top-0 flex flex-col items-center justify-center min-h-screen h-screen w-full min-w-full bg-gray-300 left-0 bg-opacity-50"
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-96 h-auto min-h-[100px] bg-white rounded-lg shadow-lg gap-3 flex flex-col overflow-hidden py-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900 bg-gray-100 px-4 py-2">
              Remark
            </h2>
            <div className="px-4">
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="remark"
                  id="remark"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default RemarkModal;
