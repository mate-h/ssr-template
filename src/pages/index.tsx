import { useServer } from "@/lib/hooks/server";
import fetch from "isomorphic-fetch";

const Index = () => {
  const result = useServer(async () => {
    // fetch ip api
    const res = await fetch("https://api.ipify.org?format=json");
    const ip = await res.json();
    return ip;
  }, "/?ip");
  return <div>
    Index
    <pre>
      {JSON.stringify({result}, null, 2)}
    </pre>
  </div>;
};
export default Index;
