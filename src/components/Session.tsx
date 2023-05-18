import { useAppDispatch } from "@/store";
import { setUser } from "@/store/user";
import { account } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};
const Session = ({ children }: Props) => {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    account
      .get()
      .then((res) => {
        console.log(res);
        dispatch(
          setUser({
            name: res.name,
            email: res.email,
          })
        );
        setActive(true);
      })
      .catch((err) => {
        dispatch(
          setUser({
            name: "",
            email: "",
          })
        );
        router.push("/login");
      });
  }, [router, dispatch]);

  return <>{active ? children : null}</>;
};

export default Session;
