import { useEffect, useState } from "react";
import Datepicker from "../DatePicker";
/* import SearchBar from "../SearchBar"; */
import { AiOutlinePlus } from "react-icons/ai";
import { CgFileAdd } from "react-icons/cg";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../store";
import { setSearch } from "../../store/search";
import { useRouter } from "next/router";

/* const Container = styled("div", {
  width: "100%",
  height: "50px",
  start: true,
  gap: "$gapMedium",
});

const DateContainer = styled("div", {
  width: "250px",
  height: "50px",
  minWidth: "156px",
}); */

const StocksHeader = () => {
  const search = useAppSelector((state) => state.search);
  const [query, setQuery] = useState<string>(search);
  const [date, setDate] = useState<Date | null>(new Date());
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    console.log("query", query);
    dispatch(setSearch(query));
  }, [query, dispatch]);

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(setSearch(""));
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [dispatch, router.events]);

  return (
    <div>
      <div>
        <Datepicker date={date} setDate={setDate} />
      </div>
      {/* <SearchBar query={query} setQuery={setQuery} /> */}
      {/* <button as={Link} href="/stocks/new">
        <Text type="MediumSemibold">Add</Text>
        <Text type="MediumSemibold">New</Text>
        <Text type="MediumSemibold">Stock</Text>
        <CgFileAdd fontSize={18} color={theme.colors.content.value} />
      </button> */}
      {/* <Button as={Link} href="/orders/new">
        <Text type="MediumSemibold">Place</Text>
        <Text type="MediumSemibold">Order</Text>
        <AiOutlinePlus fontSize={18} color={theme.colors.content.value} />
      </Button> */}
    </div>
  );
};

export default StocksHeader;
