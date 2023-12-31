import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store";
import { account } from "@/utils/client";
import { toast } from "react-hot-toast";

type Navigation = {
  name: string;
  href: string;
};

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const userNavigation = [
    { name: "Sign out", action: logoutHandler },
    {
      name: "Settings",
      action: () => router.push("/settings"),
    },
  ];
  const navigation: Navigation[] = [
    { name: "Stocks", href: "/stocks" },
    { name: "Orders", href: "/orders" },
    { name: "Clients", href: "/clients" },
    { name: "Upload", href: "/upload" },
  ];
  const [currentTab, setCurrentTab] = useState<string>("");
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (router.pathname !== currentTab) {
      setCurrentTab(router.pathname);
    }
  }, [router.pathname, currentTab]);

  async function logoutHandler() {
    await account.getSession("current").then(async (session) => {
      const id = session.$id;
      await account
        .deleteSession(id)
        .then(() => {
          router.push("/login");
        })
        .catch((err) => {
          toast.error("Error logging out.");
        });
    });
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Disclosure as="nav" className="bg-white shadow-sm">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Image
                        className="block h-6 w-auto lg:hidden"
                        src="./Logo3.svg"
                        alt="Your Company"
                        width={6}
                        height={6}
                      />
                      <Image
                        className="hidden h-6 w-auto lg:block"
                        src="./Logo3.svg"
                        alt="Your Company"
                        width={6}
                        height={6}
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            item.href === currentTab
                              ? "border-indigo-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                          )}
                          aria-current={
                            item.href === currentTab ? "page" : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-indigo-400 flex justify-center items-center">
                            {user.name
                              .split(" ")
                              .slice(0, 2)
                              .map((name) => name.charAt(0).toLocaleUpperCase())
                              .join("")}
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item
                            as="p"
                            className="px-4 pt-2 pb-1 text-xs text-gray-900 font-medium"
                          >
                            {user.name}
                          </Menu.Item>
                          <Menu.Item
                            as="p"
                            className="px-4 pt-0 pb-2 text-xs text-gray-400"
                          >
                            {user.email}
                          </Menu.Item>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <button
                                  onClick={item.action}
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                  )}
                                >
                                  {item.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={cn(
                        item.href === currentTab
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                      )}
                      aria-current={
                        item.href === currentTab ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-400 flex justify-center items-center">
                        {user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((name) => name.charAt(0).toLocaleUpperCase())
                          .join("")}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                    {/* <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="button"
                        onClick={item.action}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
