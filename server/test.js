import dns from "dns/promises";

try {
  const result = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.rex5ix8.mongodb.net"
  );

  console.log("SRV Records:");
  console.log(result);
} catch (err) {
  console.error(err);
}