import { useAppDispatch } from "@/store";
import { setUser } from "@/store/user";
import { account } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../Loader";

type Props = {
  children: React.ReactNode;
};
const SessionPrivate = ({ children }: Props) => {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const privatePages = ["/stocks", "/orders", "/clients", "/upload"];
    const publicPages = ["/login", "/signup", "/"];

    account
      .get()
      .then((res) => {
        dispatch(
          setUser({
            name: res.name,
            email: res.email,
          })
        );
        setActive(true);
        /* if (publicPages.includes(router.pathname)) {
          router.push("/stocks");
        } */
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

  return <>{active ? children : <Loader />}</>;
};

export default SessionPrivate;
