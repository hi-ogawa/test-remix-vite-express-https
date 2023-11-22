import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return json("hello loader data");
}

export default function Route() {
  const loaderData = useLoaderData<typeof loader>();
  return <div>{loaderData} hmr?</div>;
}
